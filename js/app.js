var crypto = function () {
    $("#btn_continue").click(function () {
        $("#frm_pInfo").hide();
        $("#frm_crypto").show();
    });
    $("#btn_back").click(function () {
        $("#frm_pInfo").show();
        $("#frm_crypto").hide();
    });
    $("#btn_save").click(function () {
        genRsaKey();
    });
    function genRsaKey() {
        var keylen = $("#txt_key_len").val();
        var passphrase = $("#txt_passphrase").val();
        var data=JSON.stringify({keylen:keylen,passphrase:passphrase});
        $.ajax({
            url: "/genRsaKey",
            type: "POST",
            data: data,
            success: function (response) {
                alert("Gen RSA Key success");
            },
            error: function () {
                alert("Gen RSA Key error");
            }
        });
    }
}();