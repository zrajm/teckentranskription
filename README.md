# Teckentranskription

This repository contains four separate projects, all centered around the
Swedish Sign Language and its transcription system:

  * [A lexicon](#lexicon)
  * [An intro to the transcription system](#intro-to-the-transcription-system)
  * [A transcription tool](#transcription-tool)
  * [The FreeSans-SWL typeface](#freesans-swl-typeface)


## [Lexicon]

The lexicon aims to do two things above and beyond what the [official
lexicon][teckenlexikon] currently provides, namely:

  * **It’s *FAST!*** – Searches are performed locally, which means that (after
    the initial page load) nothing needs to be transmitted over the network,
    and the only limiting factor for search speed is the speed of your own
    computer. – Even if you perform a search which displays *all the words in
    the lexicon* you’ll see the results *immediately*. (Videos and thumbnails
    are still loaded over the network, however.)

  * **It’s transcription centered** – Search for a sign language transcription
    (whole or partial) is *just as easy* as to search for a Swedish
    translation. This means you can find signs you have *only seen performed,*
    and don’t have a translation for. (There’s an on-screen keyboard for
    entering transcription symbols, and you can, of course, also copy/paste
    transcriptions for searching, or inclusion in other texts.)

The lexicon is slowly maturing, but it still doesn’t show all the information
that is available in the official lexicon. However, each search result also
contain a link to the article in the official lexicon – so you can easily find
their material as well (like sign categories, longer descriptions of the signs
and example sentence videos).

In the future we hope sort matches by relevance to your search, add categories
(for dialects, unusual signs, or different usage categories like ’numbers’,
’cooking’ etc) and allow for fuzzier searches (by automatically searching for
synonyms and spellchecking your query).

Fresh data is (automatically) imported every week from the official [Swedish
Sign Language Lexicon][teckenlexikon]. The exact date of the latest import is
can be seen on the dictionary page.


## [Intro to the Transcription System][intro]

This is an article which aims to explain all the intricacies of the
transcription system in an exhaustive, yet straightforward, way. It also
contains a detailed history of the symbols, describing when the usage of each
symbol began, and (in relevant cases) ended.


## [Transcription Tool]

This is a tool to aid you in writing Swedish Sign Language transcription which
doesn’t require you to install any special software. It is very similar to the
on-screen keyboard in the lexicon, and for smaller transcriptions you might
actually *prefer* to use the lexicon (for both editing and sharing), however,
the transcription tool is better suitable for longer texts, or when you want to
share a transcription without necessarily also sharing a lexicon search result.

Use the transcription tool to:

  * **Write transcriptions** – Just as with the lexicon, use your computer’s
    keyboard to input text and the on-screen keyboard to write transcription
    symbols. You can also use copy/paste to move the results back and forth
    between your favourite word processor and the transcription tool. (To get
    the transcription symbols to work in your favourite word processor, just
    [install the transcription font](#installing).)

  * **Share transcriptions with other people** – Use the ’Share…’ button to
    create a link to your transcription. Unfortunately there is no way to
    reliably display a transcription in an email (it works in some email
    programs, but not most of them) but sending a link to a transcript might be
    the next best thing when communicating with your colleagues.


## [FreeSans-SWL Typeface][freesans-swl]

All of the above projects make use of the [FreeSans-SWL] font. The font is a
version of *GNU FreeSans* (from the [GNU FreeFont family][freefont]), extended
to include the symbols used by the Swedish Sign Language transcription system
(the transcription system used by the official [Swedish Sign Language
Lexicon][teckenlexikon]).

This is a high quality sans-serif typeface, suitable for text in any language
supported by Unicode, as well as transcriptions of Swedish Sign Language – the
intent is to provide *one* typeface which can be used for an entire article,
both for the main text *and* transcriptions.

(*SWL* is the [ISO code][iso] for *Swedish Sign Language*.)

### Installing

If you’re only using the tools described on this page, you won’t need to
install the font on your computer, but if you want to use sign language
transcriptions in your own documents (article, thesis, web page, etc) – the
easiest way to do that is to install *FreeSans-SWL.* It is a TrueType font
which works well on MacOS, Windows and Linux.

Download the [FreeSans-SWL TrueType font][truetype], then click on it to open
the file. – On most computers this will result in the computer asking whether
or not you want to install the font in question.

Thereafter, use the [transcription tool](#transcription-tool) to write the
transcriptions you need and copy/paste them into your document. Or copy/paste
whatever you need straight from [the lexicon](#lexicon).


### Technical Info

The font uses Unicode’s *Supplementary Private Use Area-B,* specifically the
codepoints between `U+10c900` and `U+10c9ff`.

An attempt was made to register this writing system with the Under-ConScript
Unicode Registry ([UCSUR]) in October 2017, but the request was denied by UCSUR
with the suggestion it should be registered with the Unicode Technical
Committee ([UTC]).

[lexicon]: https://zrajm.github.io/teckentranskription/lexicon.html
[transcription tool]: https://zrajm.github.io/teckentranskription/
[intro]: https://zrajm.github.io/teckentranskription/intro.html
[freesans-swl]: https://zrajm.github.io/teckentranskription/freesans-swl.html "Technical description of FreeSans-SWL (in Swedish)"
[freefont]: https://www.gnu.org/software/freefont/ "GNU Freefont Page"
[teckenlexikon]: http://teckensprakslexikon.su.se/ "Svenskt teckenspråkslexikon (in Swedish)"
[iso]: https://en.wikipedia.org/wiki/ISO_639:s "Wikipedia article describing the ISO 639 standard"
[truetype]: https://zrajm.github.io/teckentranskription/freesans-swl.ttf "FreeSans TrueType font"
[UCSUR]: https://en.wikipedia.org/wiki/Under-ConScript_Unicode_Registry "Wikipedia article with description of UCSUR"
[UTC]: https://en.wikipedia.org/wiki/Unicode_Technical_Committee "Wikipedia article with description of UTC"

<!--[eof]-->
