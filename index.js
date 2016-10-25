/* */
function makeSignSelector(spec){
    var selected = spec.current || 0,
        signs = spec.signs,
        jqelement = spec.element,
        status_callback = spec.status_callback,
        status_prefix = spec.prefix // "";
    function setSign(sign) {
        var file = sign[0], message = sign[1];
        jqelement.css("background-image", "url('" + file + "')");
        status_callback(status_prefix + message);
    }
    function handle_handform(event) {
        switch (event.key) {
        case "ArrowLeft":
            selected -= 1;
            if (selected < 0) { selected += signs.length; }
            break;
        case "ArrowRight":
            selected = selected + 1;
            if (selected >= signs.length) { selected -= signs.length; }
            break;
        default:
            console.log(event.key);
            return true;
        }
        console.log(selected + ": " + signs[selected]);
        setSign(signs[selected]);
        return false;
    }
    setSign(signs[selected]);
    jqelement.keydown(handle_handform);
    return {};
}

var statusElement = $('.status');
function status(message) {
    statusElement.html(message);
}

var handshape = makeSignSelector({
    element: $('.lagen'),
    //current: 15,
    status_callback: status,
    prefix: "Artikulationsställe (A): ",
    signs: [
        ["pic/space_Truetrans2.svg", "Neutrala läget"],
        ["pic/exclam_Truetrans1.svg", "Hjässan"],
        ["pic/parenright_Truetrans1.svg", "Ansiktet, huvudhöjd"],
        ["pic/numbersign_Truetrans1.svg", "Ansiktet, övre del"],
        ["pic/sterling_Truetrans1.svg", "Ansiktet, nedre del"],
        ["pic/dollar_Truetrans1.svg", "Pannan"],
        ["pic/sterling_Truetrans2.svg", "Ögat"],
        ["pic/percent_Truetrans1.svg", "Ögonen"],
        ["pic/bracketleft_Truetrans1.svg", "Näsan"],
        ["pic/bracketright_Truetrans1.svg", "Sidorna av huvudet, öronen"],
        ["pic/asterisk_Truetrans1.svg", "Sidan av huvudet, örat, höger"],
        ["pic/plus_Truetrans1.svg", "Sidan av huvudet, örat, vänster"],
        ["pic/comma_Truetrans1.svg", "Kinderna"],
        ["pic/hyphen_Truetrans1.svg", "Kinden, höger"],
        ["pic/period_Truetrans1.svg", "Kinden, vänster"],
        ["pic/slash_Truetrans1.svg", "Munnen"],
        ["pic/colon_Truetrans1.svg", "Hakan"],
        ["pic/semicolon_Truetrans1.svg", "Nacken"],
        ["pic/less_Truetrans1.svg", "Halsen"],
        ["pic/greater_Truetrans1.svg", "Axlarna"],
        ["pic/question_Truetrans1.svg", "Axeln, höger"],
        ["pic/underscore_Truetrans1.svg", "Axeln, vänster"],
        ["pic/zero_Truetrans1.svg", "Överarmen"],
        ["pic/one_Truetrans1.svg", "Underarmen"],
        ["pic/asciitilde_Truetrans1.svg", "Armen"],
        ["pic/two_Truetrans1.svg", "Bröstet"],
        ["pic/three_Truetrans1.svg", "Bröstet, höger sida"],
        ["pic/four_Truetrans1.svg", "Bröstet, vänster sida"],
        ["pic/five_Truetrans1.svg", "Magen, mellangärdet"],
        ["pic/six_Truetrans1.svg", "Höfterna"],
        ["pic/seven_Truetrans1.svg", "Höften, höger"],
        ["pic/eight_Truetrans1.svg", "Höften, vänster"],
        ["pic/nine_Truetrans1.svg", "Benet"],
    ]
});

var handshape = makeSignSelector({
    element: $('.handform'),
    current: 15,
    status_callback: status,
    prefix: "Handform (H): ",
    signs: [
        ["pic/space_Truetrans2.svg", "4-handen FIXME"],
        ["pic/C_Truetrans1.svg", "A-handen"],
        ["pic/c_Truetrans1.svg", "Tumvinkelhanden"],
        ["pic/F_Truetrans1.svg", "Tumhanden"],
        ["pic/j_Truetrans1.svg", "Måtthanden"],
        ["pic/h_Truetrans1.svg", "Raka måtthanden"],
        ["pic/space_Truetrans2.svg", "D-handen FIXME"],
        ["pic/H_Truetrans1.svg", "Nyphanden"],
        ["pic/l_Truetrans1.svg", "Lilla O-handen"],
        ["pic/f_Truetrans1.svg", "E-handen"],
        ["pic/space_Truetrans2.svg", "F-handenFIXME"],
        ["pic/E_Truetrans1.svg", "Knutna handen"],
        ["pic/Q_Truetrans1.svg", "Stora nyphanden"],
        ["pic/P_Truetrans1.svg", "Lillfingret"],
        ["pic/p_Truetrans1.svg", "Flyghanden"],
        ["pic/A_Truetrans1.svg", "Flata handen"],
        ["pic/a_Truetrans1.svg", "Flata tumhanden"],
        ["pic/I_Truetrans1.svg", "Krokfingret"],
        ["pic/m_Truetrans1.svg", "K-handen"],
        ["pic/g_Truetrans1.svg", "Pekfingret"],
        ["pic/G_Truetrans1.svg", "L-handen"],
        ["pic/o_Truetrans1.svg", "M-handen"],
        ["pic/k_Truetrans1.svg", "N-handen"],
        ["pic/e_Truetrans1.svg", "O-handen"],
        ["pic/space_Truetrans2.svg", "Q-handen FIXME"],
        ["pic/r_Truetrans2.svg", "Långfingret"],
        ["pic/d_Truetrans1.svg", "S-handen"],
        ["pic/D_Truetrans1.svg", "Klohanden"],
        ["pic/i_Truetrans1.svg", "T-handen"],
        ["pic/J_Truetrans1.svg", "Hållhanden"],
        ["pic/U_Truetrans2.svg", "Dubbelkroken"],
        ["pic/N_Truetrans1.svg", "Böjda tupphanden"],
        ["pic/L_Truetrans1.svg", "V-handen"],
        ["pic/M_Truetrans1.svg", "Tupphanden"],
        ["pic/B_Truetrans1.svg", "Vinkelhanden"],
        ["pic/w_Truetrans2.svg", "W-handen"],
        ["pic/R_Truetrans1.svg", "X-handen"],
        // ["pic/Z_Truetrans2.svg", "X-handen"],
        ["pic/b_Truetrans1.svg", "Sprethanden"],
        ["pic/q_Truetrans1.svg", "Stora långfingret"],
        ["pic/aring_Truetrans1.svg", "Runda långfingret"],
    ]
});

var direction = makeSignSelector({
    element: $('.riktning'),
    current: 4,
    status_callback: status,
    prefix: "Attitydsriktning (AR): ",
    signs: [
        ["pic/r_Truetrans1.svg", "Vänster"],
        ["pic/s_Truetrans1.svg", "Höger"],
        ["pic/S_Truetrans1.svg", "Fram"],
        ["pic/t_Truetrans1.svg", "In"],
        ["pic/T_Truetrans1.svg", "Upp"],
        ["pic/u_Truetrans1.svg", "Ner"],
    ]
});

var twist = makeSignSelector({
    element: $('.vridning'),
    current: 2,
    status_callback: status,
    prefix: "Attitydsvridning (AV): ",
    signs: [
        ["pic/U_Truetrans1.svg", "Vänster"],
        ["pic/v_Truetrans1.svg", "Höger"],
        ["pic/V_Truetrans1.svg", "Fram"],
        ["pic/w_Truetrans1.svg", "In"],
        ["pic/W_Truetrans1.svg", "Upp"],
        ["pic/x_Truetrans1.svg", "Ner"],
    ]
});

$('.handform').focus();

/*[eof]*/
