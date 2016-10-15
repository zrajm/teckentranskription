/* */
function makeGlyphSelector(spec){
    var selected = spec.current || 0,
        glyphs = spec.glyphs,
        jqelement = spec.element;
    function setGlyph(file) {
        jqelement.css("background-image", "url('" + file + "')");
    }
    function handle_handform(event) {
        switch (event.key) {
        case "ArrowLeft":
            selected -= 1;
            if (selected < 0) { selected += glyphs.length; }
            break;
        case "ArrowRight":
            selected = selected + 1;
            if (selected >= glyphs.length) { selected -= glyphs.length; }
            break;
        default:
            console.log(event.key);
        }
        console.log(selected + ": " + glyphs[selected]);
        setGlyph(glyphs[selected]);
    }
    setGlyph(glyphs[selected]);
    jqelement.keydown(handle_handform);
    return {};
}

var handshape = makeGlyphSelector({
    element: $('.handform'),
    current: 15,
    glyphs: [
        "pic/space_Truetrans2.svg", "pic/C_Truetrans1.svg", "pic/c_Truetrans1.svg",
        "pic/F_Truetrans1.svg", "pic/j_Truetrans1.svg", "pic/h_Truetrans1.svg",
        "pic/space_Truetrans2.svg", "pic/H_Truetrans1.svg", "pic/l_Truetrans1.svg",
        "pic/f_Truetrans1.svg", "pic/space_Truetrans2.svg", "pic/E_Truetrans1.svg",
        "pic/Q_Truetrans1.svg", "pic/P_Truetrans1.svg", "pic/p_Truetrans1.svg",
        "pic/A_Truetrans1.svg", "pic/a_Truetrans1.svg", "pic/I_Truetrans1.svg",
        "pic/m_Truetrans1.svg", "pic/g_Truetrans1.svg", "pic/G_Truetrans1.svg",
        "pic/o_Truetrans1.svg", "pic/k_Truetrans1.svg", "pic/e_Truetrans1.svg",
        "pic/space_Truetrans2.svg", "pic/r_Truetrans2.svg", "pic/d_Truetrans1.svg",
        "pic/D_Truetrans1.svg", "pic/i_Truetrans1.svg", "pic/J_Truetrans1.svg",
        "pic/U_Truetrans2.svg", "pic/N_Truetrans1.svg", "pic/L_Truetrans1.svg",
        "pic/M_Truetrans1.svg", "pic/B_Truetrans1.svg", "pic/w_Truetrans2.svg",
        "pic/R_Truetrans1.svg", "pic/Z_Truetrans2.svg", "pic/b_Truetrans1.svg",
        "pic/q_Truetrans1.svg", "pic/aring_Truetrans1.svg",
    ]
});

var direction = makeGlyphSelector({
    element: $('.riktning'),
    current: 4,
    glyphs: [
        "pic/r_Truetrans1.svg",
        "pic/s_Truetrans1.svg",
        "pic/S_Truetrans1.svg",
        "pic/t_Truetrans1.svg",
        "pic/T_Truetrans1.svg",
        "pic/u_Truetrans1.svg",
    ]
});

var twist = makeGlyphSelector({
    element: $('.vridning'),
    current: 2,
    glyphs: [
        "pic/U_Truetrans1.svg",
        "pic/v_Truetrans1.svg",
        "pic/V_Truetrans1.svg",
        "pic/w_Truetrans1.svg",
        "pic/W_Truetrans1.svg",
        "pic/x_Truetrans1.svg",
    ]
});

/*[eof]*/
