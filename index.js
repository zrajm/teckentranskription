


function makeGlyphSelector(spec){
    var selected = 0,
        glyphs = spec.glyphs || [];

    function handle_handform(event) {
        if (event.key === "ArrowLeft") {
            selected -= 1;
            if (selected < 0) {
                selected =  glyphs.length - 1;
            }
        } else if (event.key === "ArrowRight") {
            selected += 1;
            if (selected >= glyphs.length) {
                selected = 0;
            }
        } else {
            console.log(event.key);
        }
        console.log(selected + ": " + glyphs[selected]);
        $(this).css("background-image", "url('" + glyphs[selected] + "')");
    }

    return {
        handler: handle_handform,
    };
}



var handshape = makeGlyphSelector({
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

$('.handform').keydown(handshape.handler);

// //[eof]
