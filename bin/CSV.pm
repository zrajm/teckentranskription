package CSV;
use strict;
use warnings;
use Carp;
use feature ":5.10";

=pod

=head1 NAME

=head1 SYNOPSIS

    use CSV;
    my $csv = new CSV({
        delimiter_in  => ",",    # use comma as input delimiter
        delimiter_out => "\t",   # use tab as output delimiter
        quote         => '"',    # quote values with doublequote
        quote_empty   => 0,      # don't quote empty fields
        quote_number  => 1,      # quote numbers
    });

    my @label = $csv->split(scalar(<>)); # read labels from STDIN
    print $csv->join(@label);            # output them on STDOUT

    my $col = $csv->grep_column("in", qr/^user$/i); # find "user" column
    while (my @field = $csv->split(scalar(<>))) {
        # output all users on STDOUT except users Brown, Smith and Jones
        print $csv->join(@field)
            unless $field[$col] =~ m/(brown|smith|jones)/i;
    }


=head1 DESCRIPTION

This is a module which offers a very simple interface for parsing and creating
B<character-separated value> (CSV) data.

It contains helper functions for converting lines of CSV data into actual
values, and vice versa, however it does not take care of file operations for
you, so you still have to open(), close() and read your files manually.

A good definition of the CSV format can be found on Wikipedia
[http://en.wikipedia.org/wiki/.csv].


=head1 OPTIONS

=over 8

=item delimiter (default: ",")

Input/output delimiter (separating values).

=item delimiter_in (default: same as "delimiter")

Input delimiter (separating values). Overrides C<delimiter> if both are used.

=item delimiter_out (default: same as "delimiter")

Output delimiter (separating values). Overrides C<delimiter> if both are used.

=item escape (default: undef)

Input/output escapes. If undef, uses the current "quote" as an escape
character.

=item escape_in (default: same as "escape")

Input escape character. If undef, uses the current "quote" as an escape
character. Overrides C<escape> if both are used.

=item escape_out (default: same as "escape")

Output escape character. If undef, uses the current "quote" as an escape
character. Overrides C<escape> if both are used.

=item quote_empty (default: 1)

Quote empty values in output?

=item quote_number (default: 1)

Quote all values in output?

=item quote (default: ")

Quote sign used on input/output.

=item quote_in (default: same as "quote")

Quote sign used on input. Overrides C<quote> if both are used.

=item quote_out (default: same as "quote")

Quote sign used on output. Overrides C<quote> if both are used.

=back

=head1 FUNCTIONS

=head2 $CSV = new CSV([ { OPTION => VALUE, ... } ]);

Initialize a CSV object and set the specified OPTIONS.

=cut

sub new {
    my ($class, $options_ref) = @_;
    my $self = {                    # defaults
        delimiter_in  => q{,},      # input delimiter (separating fields)
        delimiter_out => q{,},      # output delimiter (separating fields)
        escape_in     => undef,     # undef = use quote_in to escape quotes
        escape_out    => undef,     # undef = use quote_out to escape quotes
        labels_in     => [],        # input labels (defined by 1st split())
        labels_out    => [],        # output labels (defined by 1st join())
        quote_empty   => 1,         # quote empty fields in output?
        quote_number  => 1,         # quote all fields in output?
        quote_in      => q{"},      # quote sign used on input
        quote_out     => q{"},      # quote sign used on output
    };
    $self = bless($self, $class);
    return $self->set($options_ref);
}

=head2 $CSV = set CSV({ OPTIONS });

Can be used to set one or more options.

=cut

sub set {
    my ($self, $opt_ref) = @_;
    # process option aliases first
    # (so that these will be overridden subsequent "<OPT>_in" or "<OPT>_out" option)
    foreach my $opt (qw(delimiter escape quote)) {
        next unless exists($opt_ref->{$opt});
        my $arg = delete($opt_ref->{$opt});    # remove opts as they're processed
        if ($opt ne "quote") {
            length($arg) != 1 && croak __PACKAGE__ . "::set(): option '$opt' argument must be exactly one character";
        } else {
            length($arg) > 1 && croak __PACKAGE__ . "::set(): option '$opt' argument may not be more than one character";
        }
        $self->{$opt . "_in"}  = $arg;
        $self->{$opt . "_out"} = $arg;
    }

    # process normal options
    while (my ($opt, $arg) = each(%$opt_ref)) {
        my $err_msg = __PACKAGE__ . "::set(): option '$opt' argument";
        for ($opt) {
            # delimiter character settings
            if (/^delimiter_in$/) {
                length($arg) != 1 and croak "$err_msg must be exactly one character";
                $self->{$opt} = $arg;
                next;
            };
            if (/^delimiter_out$/) {
                length($arg) != 1 and croak "$err_msg must be exactly one character";
                $self->{$opt} = $arg;
                next;
            }
            # escape character settings
            if (/^escape_in$/) {
                length($arg) != 1 and croak "$err_msg must be exactly one character";
                $self->{$opt} = $arg;
                next;
            }
            if (/^escape_out$/) {
                length($arg) != 1 and croak "$err_msg must be exactly one character";
                $self->{$opt} = $arg;
                next;
            }
            # quote character settings
            if (/^quote_number$/) {
                $self->{$opt} = $arg ? 1 : "";
                next;
            }
            if (/^quote_empty$/) {
                $self->{$opt} = $arg ? 1 : "";
                next;
            }
            if (/^quote_in$/) {
                length($arg) > 1 and croak "$err_msg may not be more than one character";
                $self->{$opt} = $arg;
                next;
            }
            if (/^quote_out$/) {
                length($arg) > 1 and croak "$err_msg may not be more than one character";
                $self->{$opt} = $arg;
                next;
            }
            croak __PACKAGE__ . "::set(): unknown option '$opt'";
        }
    } # end foreach $opt

    # check that required options are set
    foreach my $opt (qw(quote_in quote_out delimiter_in delimiter_out)) {
        defined($self->{$opt}) or croak __PACKAGE__ . "::set(): option '$opt' in required";
    }

    # re-calc field matcher regex
    # (defines what a field look like on input)
    $self->{field_match_re} = do {
        my $delim = $self->{delimiter_in};
        my $quote = $self->{quote_in};
        if ($quote) {
            qr{(?|$quote((?:$quote$quote|[^$quote])*)$quote|([^$delim]*))};
        } else {
            qr{([^$delim]*)};
        }
    };

    # re-calc quote matcher regex
    # (fields matching this will be unquoted on output)
    $self->{unquoted_match_re} = do {
        my $opt = $self->{quote_empty} ? "" : "?";
        if ($self->{quote_number}) {
            # quote all values (except, optionally, empty ones)
            qr/^(?:\z.\A)$opt$/;
        } else {
            # don't quote numbers (and, optionally, not empty values)
            qr/^-?(?:0|[1-9][0-9]*)$opt$/;
        }
    };
    return $self;
}

=head2 @VALUE = $CSV->split($STRING);

Splits a $STRING of character-separated values into @VALUE. When reading from
STDIN you might want to use split(scalar(<>)) to avoid slurping all lines of
input from STDIN.

Returns empty list if if $STRING is undefined, thus you can do this (since
@value will be empty list at eof, breaking the loop):

    while(@value = split(<$fh>)) {
        # do something
    }

NOTE: All calls to $CSV->split() must have the same number of values each time,
otherwise it'll croak(). This, however, needn't be the same number of fields
given to $CSV->join(). -- So you can have one number of values in your input
file, and another number of values in your output file.

=cut

sub split {
    (my $self, local $_) = (@_, $_);
    return () unless defined($_);
    my ($value, $delim, $escape, @label) = (
        $self->{field_match_re},
        $self->{delimiter_in},
        $self->{escape_in} // $self->{quote_in},
        @{$self->{labels_in}},
    );
    chomp;
    my @value = (m/\G$value$delim/g, m/$value$/);
    if ($escape) {
        @value = map {
            s/(?|([^$escape]+)|$escape(.))/$1/g;
            $_;
        } @value;
    }
    if (@label == 0) {                         # 1st read line
        $self->{labels_in} = \@value;
    } else {                                   # subsequent lines
        croak "$0 \$CSV->split(): " . (@value - @label) . " too many values in file '$ARGV', at line $.\n",
            map { "    $label[$_]: '$value[$_]'\n" } 0..$#value if @value > @label;
        croak "$0 \$CSV->split():" . (@label - @value) . " too few values in file '$ARGV', at line $.\n",
            map { "    $label[$_]: '$value[$_]'\n" } 0..$#value if @value < @label;
    }
    return(@value);
}

=head2 $STRING = $CSV->join(@VALUE);

Joins values found in @VALUE and returns a $STRING, suitable for output.

NOTE: All calls to $CSV->join() must have the same number of values each time,
otherwise it'll croak(). This, however, needn't be the same number of values as
given to $CSV->split(). -- So you can have one number of values in your input
file, and another number of values in your output file.

=cut

sub join {
    my ($self, @value) = @_;
    my ($delim, $quote, $escape, @label) = (
        $self->{delimiter_out},
        $self->{quote_out},
        $self->{escape_out} // $self->{quote_out},
        @{$self->{labels_out}},
    );
    if (@label == 0) {                         # 1st read line
        $self->{labels_out} = \@value;
    } else {                                   # subsequent lines
        croak "$0 \$CSV->join(): " . (@value - @label) .
            " too many values in file '$ARGV', at line $.\n",
            map {
                "    " . ($label[$_] // "<UNDEF>") . ": '$value[$_]'\n";
            } 0..$#value if @value > @label;
        croak "$0 \$CSV->join(): " . (@label - @value) .
            " too few values in file '$ARGV', at line $.\n",
            map {
                "    " . ($label[$_] // "<UNDEF>") . ": '$value[$_]'\n";
            } 0..$#value if @value < @label;
    }
    return join($delim, map {
        s/([$escape$quote])/$escape$1/g;    # escape quote and escape chars
        m/$self->{unquoted_match_re}/       # numbers without leading zeroes
            ? $_                            #   output as-is
            : $quote . $_ . $quote;         #   otherwise quote
    } @value) . "\n";
}

=head2 @COLUMN_NUMBER = $CSV->grep_column($TYPE, $REGEX);

Returns @COLUMN_NUMBER(s) of all the columns which have a label matching the
qr// expression $REGEX. $TYPE, which may be either "in" or "out", specifies
whether to search the labels of the input or output labels.

For grep_column() to work you must have either done a $CSV->split() (when $TYPE
= "in") or a $CSV->join() (when $TYPE = "out"), otherwise there are no stored
labels to search.

=cut

sub grep_column {
    my ($self, $label_type, $regex) = @_;
    croak "$0: 1st argument to grep_column() must be 'in' or 'out', "
        unless $label_type =~ /^(?:in|out)$/;
    croak "$0: 2nd argument to grep_column() must be regular expression, "
        unless ref($regex) eq "Regexp";
    croak "$0: call to \$CSV->split() or \$CSV->join() required before grep_column(), "
        if @{$self->{"labels_$label_type"}} == 0;
    my @label = @{$self->{"labels_$label_type"}};

    # list context: return all matches
    return grep { $label[$_] =~ $regex } 0..$#label
        if wantarray();

    # scalar context: return 1st match
    foreach (0..$#label) {
        return($_ == 0 ? "0 but true" : $_)
            if $label[$_] =~ $regex;
    }
    return "";
}

=head1 MAYBE

 * warn if there are zero values when readnig 1st line/labels
 * option for line break style Unix (/\n/), DOS (/\r\n/) and Macintosh (/\r/)
 * "strip_spaces" option for removing leading/trailing spaces
 * function for reading & storing labels in object
 * error-checking for complaining about to many/too few values (requires above
   labels, or other way to specify number of values)
 * retrieve value by name / by number
 * ($label, $value) = each(); function
 * when "escape" is set to backslash "\" input & output are not identical a
   quotemeta() should probably be used somewhere
 * autodetection of: delimiter, quoting and line breaks

=cut

1;

#[eof]
