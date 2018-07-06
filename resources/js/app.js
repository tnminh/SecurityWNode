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
    function createData() {
        var keylen = $("#txt_key_len").val();
        var passphrase = $("#txt_passphrase").val();
        var email = $("#txt_email").val();
        var name = $("#txt_name").val();
        var birthday = $("#txt_dob").val();
        var phone = $("#txt_phone").val();
        var adr = $("#txt_adr").val();
        var pData = {
            email: email,
            name: name,
            birthday: birthday,
            phone: phone,
            adr: adr
        };
        var kData = {
            keylen: keylen,
            passphrase: passphrase
        };
        var data = JSON.stringify({ pData: pData, kData: kData });
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
var myForm = function () {
    function loadDataFromEmail(email) {
        $.ajax({
            url: "/loadData",
            type: "POST",
            data: email,
            success: function (response) {
                response= JSON.parse(response);
                appendCreatingForm(response.email,response.name,response.birthday,response.phone,response.address);
            },
            error: function () {
                alert("Gen RSA Key error");
            }
        });
    }
    function appendBeginForm(email = "") {
        if (typeof w2ui['form'] !== "undefined") {
            w2ui['form'].destroy();
        }
        $('#form_create').w2form({
            name: 'form',
            header: 'Thông tin',
            fields: [
                { field: 'email', type: 'email', required: true, html: { caption: 'Email', attr: 'style="width: 300px"' } },

            ],
            actions: {
                'Create': function (event) {
                    if (w2ui['form'].validate().length > 0) {
                        return;
                    }
                    appendCreatingForm(w2ui['form'].record['email']);
                },
                'Load': function (event) {
                    if (w2ui['form'].validate().length > 0) {
                        return;
                    }
                    loadDataFromEmail(w2ui['form'].record['email']);
                },
                'Clear': function (event) {
                    console.log('clear', event);
                    this.clear();
                }


            }
        });
        w2ui['form'].record['email'] = email;
        w2ui['form'].refresh();
    };
    function appendCreatingForm(email = "") {
        $(function () {
            w2ui['form'].destroy();
            $('#form_create').w2form({
                name: 'form',
                header: 'Thông tin',
                fields: [
                    { field: 'email', type: 'email', required: true, html: { caption: 'Email', attr: 'style="width: 300px"' } },
                    { field: 'name', type: 'text', required: true, html: { caption: 'Họ Tên', attr: 'style="width: 300px"' } },
                    { field: 'birthday', type: 'date', required: true, html: { caption: 'Ngày Sinh', attr: 'style="width: 300px"' } },
                    { field: 'phone', type: 'number', required: true, html: { caption: 'SĐT', attr: 'style="width: 300px"' } },
                    { field: 'address', type: 'textarea', required: true, html: { caption: 'Địa Chỉ', attr: 'style="width: 300px; height: 90px"' } },
                    { field: 'keyLen', type: 'number', required: true, html: { caption: 'Độ dài key', attr: 'style="width: 300px"' } },
                    { field: 'passphrase', type: 'password', required: true, html: { caption: 'Mật Khẩu', attr: 'style="width: 300px"' } },
                    { field: 'fileLocation', type: 'textarea', required: true, html: { caption: 'Đường Dẫn Export', attr: 'style="width: 300px"' } },


                ],
                actions: {
                    'Create': function (event) {
                        createData()
                    },
                    'Clear': function (event) {
                        console.log('clear', event);
                        this.clear();
                    },
                    'Back': function (event) {
                        appendBeginForm(w2ui['form'].record['email']);
                    },

                }
            });
            w2ui['form'].record['email'] = email;
            w2ui['form'].refresh();

        });
    }
    function appendLoadingingForm(email ,name,birthday,phone,address) {
        $(function () {
            w2ui['form'].destroy();
            $('#form_create').w2form({
                name: 'form',
                header: 'Thông tin',
                fields: [
                    { field: 'email', type: 'email', required: true, html: { caption: 'Email', attr: 'style="width: 300px"' } },
                    { field: 'name', type: 'text', required: true, html: { caption: 'Họ Tên', attr: 'style="width: 300px"' } },
                    { field: 'birthday', type: 'date', required: true, html: { caption: 'Ngày Sinh', attr: 'style="width: 300px"' } },
                    { field: 'phone', type: 'number', required: true, html: { caption: 'SĐT', attr: 'style="width: 300px"' } },
                    { field: 'address', type: 'textarea', required: true, html: { caption: 'Địa Chỉ', attr: 'style="width: 300px; height: 90px"' } }

                ],
                actions: {
                    'Save': function (event) {
                        console.log('save', event);
                    },
                    'Clear': function (event) {
                        console.log('clear', event);
                        this.clear();
                    },
                    'Back': function (event) {
                        appendBeginForm(w2ui['form'].record['email']);
                    },

                }
            });
            w2ui['form'].record['email'] = email;
            w2ui['form'].record['name'] = name;
            w2ui['form'].record['birthday'] = birthday;
            w2ui['form'].record['phone'] = phone;
            w2ui['form'].record['address'] = address;
            
            w2ui['form'].refresh();

        });
    }
    function createData() {
        if (w2ui['form'].validate().length > 0) {
            return;
        }
        var keylen = w2ui['form'].get('keyLen').el.value;
        if (keylen % 64 !== 0) {
            w2popup.open({
                title: 'Lỗi',
                body: '<div class="w2ui-centered">Độ dài key phải chia hết cho 64</div>'
            });
            return;
        }
        if (keylen < 512 || keylen > 1024) {
            w2popup.open({
                title: 'Lỗi',
                body: '<div class="w2ui-centered">Độ dai key phải từ (512-1024)</div>'
            });
            return;
        }
        debugger;
        var passphrase = w2ui['form'].get('passphrase').el.value;
        var email = w2ui['form'].get('email').el.value;
        var name = w2ui['form'].get('name').el.value;
        var birthday = w2ui['form'].get('birthday').el.value;
        var phone = w2ui['form'].get('phone').el.value;
        var adr = w2ui['form'].get('address').el.value;
        var fileLocation = w2ui['form'].get('fileLocation').el.value;

        var pData = {
            email: email,
            name: name,
            birthday: birthday,
            phone: phone,
            adr: adr
        };
        var kData = {
            keylen: keylen,
            passphrase: passphrase,
            fileLocation: fileLocation
        };
        var data = JSON.stringify({ pData: pData, kData: kData });
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
    appendBeginForm();
}();