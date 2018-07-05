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
        var email=$("#txt_email").val();
        var name=$("#txt_name").val();
        var birthday=$("#txt_dob").val();
        var phone=$("#txt_phone").val();
        var adr=$("#txt_adr").val();
        var pData={
            email:email,
            name:name,
            birthday:birthday,
            phone:phone,
            adr:adr};
        var kData={
            keylen:keylen,
            passphrase:passphrase};
        var data=JSON.stringify({pData:pData,kData:kData});
        $.ajax({
            url: "/saveData",
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