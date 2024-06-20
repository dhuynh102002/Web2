
$(document).ready(function(){
        load_data();
        load_cart_item();
        checkOutBag();	// lấy lại đoạn html(hiển thị sp trong giỏ) trong checkOutBag.php để vào checkout.php 
        checkOutDetails();
        loadUserInfo();
        // loadUserInfoCheckOut();

        function loadUserInfo()
        {
            $.ajax({
                url:"./XuLy/userInfo.php",
                method:"POST",
                datatype:"json",
                success:function(data)
                {
                    if(data != false)
                    {
                        data = JSON.parse(data);
                        $("#changePass").find('input[name="userName"]:hidden').val(data.userName);
                        $("#changePass").find('input[name="userId"]:hidden').val(data.userId);

                        $('#editUser').find('input[name="userId"]:hidden').val(data.userId);
                        $('#editUser').find('input[name="firstName"]').val(data.firstName);
                        $('#editUser').find('input[name="lastName"]').val(data.lastName);
                        $('#editUser').find('input[name="email"]').val(data.email);
                    }
                }
            })
        }

        $("#checkOutAddress").ready(function()
        {
            loadUserInfoCheckOut(); //nếu có đăng nhập thì load dữ liệu khách hàng lên form địa chỉ giao hàng
        })
        function loadUserInfoCheckOut()
        {
            $.ajax({
                url:"./XuLy/userInfo.php",
                method:"POST",
                datatype:"json",
                success:function(data)
                {
                    if(data != false)
                    {
                        data = JSON.parse(data);
                        $("#checkOutAddress").find('input[name="userName"]:hidden').val(data.userName);
                        $("#checkOutAddress").find('input[name="userId"]:hidden').val(data.userId)
                        $('#checkOutAddress').find('input[name="firstName"]').val(data.firstName);
                        $('#checkOutAddress').find('input[name="lastName"]').val(data.lastName);
                        $('#checkOutAddress').find('input[name="email"]').val(data.email);
                    }
                }
            })
        }
		
		//chuyển đổi giữa 2 nút giỏ vs địa chỉ
        $(document).on("click",".checkout-paging .page-link",function(event)
        {
            event.preventDefault();
            checkOutChange($(this).attr("div")); //lấy dữ liệu trong thẻ div mà người dùng nhấn vào
        })
		
        function checkOutChange(div)
        {
            if(div == "checkout-info")
            {
                $("."+div).css("display","block"); //hiển thị form địa chỉ giao hàng
                $(".checkout-bag").css("display","none"); //ẩn ds sp trong giỏ
                $("."+div+"-btn").addClass("active")
                $(".checkout-bag-btn").removeClass("active")
            }
            else if(div == "checkout-bag")
            {
                $("."+div).css("display","block");
                $(".checkout-info").css("display","none");
                $("."+div+"-btn").addClass("active")
                $(".checkout-info-btn").removeClass("active")
            }
        }

        function load_data(page)
        {
            $order = $("#sortByselect").val();
            $min = $("#sortPrice").attr('min');
            $max = $("#sortPrice").attr('max');
            $search = decodeURI(GetURLParameter('search'));//nếu người dùng có nhập (khoảng trắng hay ký tự đặc biệt) vẫn giữ đúng dữ liệu nhập vào
            $search = $search.replace("+"," ");
            console.log(GetURLParameter('search'));//nếu nhập khoảng trắng -> "dấu +" hay ký tự đặc biệt thì sẽ bị biến đổi
            $.ajax({
                url:"./XuLy/phantrang.php",
                method:"POST",
                data:{  page:page,
                        brand:GetURLParameter('brand'),
                        cetorgry:GetURLParameter('cetorgry'),
                        search:$search,
                        order:$order,
                        min:$min,
                        max:$max},
                datatype:"json",
                success:function(data)
                {
                    console.log(data);
                    data = JSON.parse(data);
                    console.log(data);
                    $("#title-shop").html(data.cetorgry);
                    $("#total-item").html(data.totalRecord);
                    $("#itemShow").html(data.output);
                    $("#pagination-box").html(data.paging);
                }
            })
        }

        //CHECK OUT
		//hiển thị sp trong giỏ
        function checkOutBag()
        {
            $.ajax({
                url :"./XuLy/checkOutBag.php",
                method:"POST",
                datatype:"json",
                success:function(data)
                {
                    data = JSON.parse(data);
                    $(".checkout-bag").html(data.checkOutBag);	//để dữ liệu vào class checkout-bag (checkout-content.php)
                }
            })
        }
		//thanh toán bên giỏ hàng 
        function checkOutDetails()
        {
            $.ajax({
                url :"./XuLy/checkOutDetails.php",
                method:"POST",
                datatype:"json",
                success:function(data)
                {
                    // console.log(data);
                    data = JSON.parse(data);
                    $(".order-details-form").html(data.checkOutDetails); //để dữ liệu vào class order-details-form trong checkout-content.php
                }
            })
        }


        function login_logout(post_url,request_method,form_data)
        {
            $.ajax({
                url: post_url,
                method: request_method,
                datatype: "json",
                data: form_data,
                success:function(data)
                {
                    
                    console.log(data);
                    data = JSON.parse(data);
                    console.log(data);
                    if(data.islogin == false)
                    {
                        $("#logout").modal("hide");
                        $("#user-info").html(data.user);
                        $("#user-login-info").html(data.userInfo);
                        window.location.reload();
                    }
                    else if(data.login == true)
                    {
                        $("#login").modal("hide");
                        console.log(data.user);
                        $("#user-info").html(data.user);
                        $("#user-login-info").html(data.userInfo);
                        loginSuccess();
                    }
                    else
                    {
                        $(".login-error").html(data.error);
                    }
                }
            })
        }
		//khi nhấn vào nút +, - (tăng, giảm số lượng), class btn-decinc trong checkOutBag.php
        $(document).on("click",".btn-decinc",function(e)
        {
            $id = $(this).attr("id");
            $quality = $(this).attr("quality");
            $min = $(this).attr("min");
            $max = $(this).attr("max");
            console.log($id);
            console.log($quality);
            console.log($min);
            console.log($max);
            valueCart($quality,$id,$min,$max);
        })

		//cập nhật số lượng trong giỏ theo id
        function valueCart(quality,id,min,max)
        {
            $max = max
            $.ajax({
                url: "./XuLy/cart-quality.php",
                method:'POST',
                data: { id: id, 
                        quality: quality, 
                        min: min,
                        max: max},
                success:function(data)
                {

                    // console.log(data);
                    // console.log(parseInt(max));
                    // console.log(parseInt(data) <= parseInt(max));
                    if( parseInt(data) >= parseInt(min) && parseInt(data) <= parseInt(max))
                    {
                        $("#"+$id+"-quality").val(data); //#-id: hiển thị số lượng(số nằm giữa dấu +,- số lượng) sau khi đã cập nhật
                        load_cart_item();
                        checkOutDetails();
                    }
                    else if(parseInt(data) > parseInt(max)){
                        alert("Hàng không đủ");
                    }
                }
            })
        }

        // LOGIN 
        $('#login-form').on("submit",function(event){
            event.preventDefault();
            var post_url = "./XuLy/validateuser.php";
            var request_method = $(this).attr("method"); //get form GET/POST method
            var form_data = $(this).serialize(); //Encode form elements for submission
            console.log(form_data);
            login_logout(post_url,request_method,form_data);
        });

        // LOGOUT
        $('#logout-form').submit(function(event){
            logout(event);
        });
        function logout(event)
        {
            event.preventDefault();
            var post_url = "./XuLy/validateuser.php";
            var request_method = $(this).attr("method"); //get form GET/POST method
            var form_data = $(this).serialize(); //Encode form elements for submission
            console.log(form_data);
            login_logout(post_url,request_method,form_data);
        }

        // XÁC NHẬN MUA
        $(document).on("click","#checkOutConfirm",function()	//checkOutConfirm: id bên checkout-content.php (trong file checkout.php)
        {
            // alert("click");
            $userName = $("#checkOutAddress").find('input[name="userName"]:hidden').val(); //trong id checkOutAddress lấy cái input có name = userName, type:hidden
            $userId = $("#checkOutAddress").find('input[name="userId"]:hidden').val();
            $firstName = $('#checkOutAddress').find('input[name="firstName"]').val();
            $lastName = $('#checkOutAddress').find('input[name="lastName"]').val();
            $country = $("select.country").children("option:selected").val();
            $street_address = $("#checkOutAddress").find('input[name="street_address"]').val();
            $phone =$("#checkOutAddress").find('input[name="phone"]').val();
            $email = $('#checkOutAddress').find('input[name="email"]').val();
            $description = $('textarea#description').val();

            $.ajax({
                url: "./XuLy/checkOutConfirm.php", //kiểm tra thông tin địa chỉ giao hàng
                method:"POST",
                data: { userName : $userName,
                        userId : $userId,
                        firstName : $firstName,
                        lastName : $lastName,
                        country : $country,
                        street_address : $street_address,
                        phone : $phone,
                        email : $email,
                        description : $description},
                success:function(data)
                {
                    console.log(data);
                    data = JSON.parse(data);
                    console.log(data);
                    if(data.isBagEmpty == true) //nếu giỏ hàng rỗng
                    {
                        sweetAlert("error","Không có hàng trong giỏ");
                    }
                    else if(data.isLogin == false) //nếu chưa đăng nhập thì thông báo yêu cầu đăng nhập mới được mua
                    {
                        SuggestLogin();
                    }
                    else if(data.isAddressError == true){ //nếu sai địa chỉ
                        $('html, body').animate({
                            scrollTop: $(".checkout_area").offset().top
                          }, 800)
                        checkOutChange("checkout-info");
                        $(".checkOutAddress-error").html(data.error); //hiển thị lỗi
                    }
                    else{
                        reloadAfterAlert("success","Cám ơn quý khách đã mua hàng");
                    }
                }
            })
        });

        // Phân Trang
        $(document).on("click",".page-item",function()
        {
            var page = $(this).attr("id");
            // window.scrollBy({
            //     top: -1500,
            //     left:0,
            //     behavior:'smooth'
            // });
            load_data(page);
        });



        // Thêm giỏ hàng SP
        $(document).on("click",".add-to-cart-btn",function()	//class add-to-cart-btn trong phantrang.php
        {
            var id = $(this).attr("id"); 
            var name = $(this).attr("name");
            var brand = $(this).attr("brand");
            var img = $(this).attr("img");
            var price = $(this).attr("price");
            var max = $(this).attr("max");
            var quality = $(".quality-item").val();
            console.log(id+name+brand+img+price);
            load_cart_item(id,name,brand,img,price,quality,max);
            addsuccess(name);
        });



        /*** Sự kiện tạo giỏ hàng */ 
        function load_cart_item(id,name,brand,img,price,quality,max)
        {
            console.log(max);
            $.ajax({
                url:"./XuLy/upToSession.php",	//thêm sp vào $_SESSION['id']
                method:"POST",
                data:{id : id,name: name,brand: brand,img: img,price: price,quality :quality ,max :max},
                datatype:"json",
                success:function(data)
                {
                    // console.log(data);
                    data = JSON.parse(data);
                    $("#cart-list").html(data.output);
                    $(".sizeBag").html(data.num); //hiển thị tổng sp trong giỏ (trên icon giỏ hàng)
                }
            });
        }
        {

        /* Xóa Item khỏi giỏ hàng */
        $(document).on("click",".product-remove",function() //class product-remove trong checkOutBag.php
        {
            $.ajax({
                url:"./XuLy/upToSession_delete.php",	//xóa sp trong $_SESSION['id']
                method:"POST",
                data:{id : $(this).attr("data")},
                datatype:"json",
                success:function(data)
                {
                    data = JSON.parse(data);
                    $("#cart-list").html(data.output);
                    $(".sizeBag").html(data.num);
                    checkOutBag();
                    checkOutDetails();
                }
            });
        });
        }
        
        /***** *********************/
        $('#search-box').on("submit",function(event)
        {
            $url = $(location).attr("pathname").split("/")[2]; 
            console.log($url);
            $search = $('#search-box').serialize();

            event.preventDefault();
            URLpush($search.split("=")[1],GetURLParameter("brand")); //chỉ đẩy dữ liệu search và brand lên url
			//lấy dữ liệu người dùng nhập để tìm. vd: value=abc thì là abc
            
            if($url != "index.php")
            {
                window.location.reload();
            }
            load_data();
        });

        $("#DK").on("submit",function(e)
        {
            e.preventDefault();
            console.log(decodeURI($(this).serialize()));
            $.ajax({
                url:"./XuLy/validation.php",
                method:"POST",
                data:{  toLogin : 1,
                        info : $(this).serialize()},
                success:function(data)
                {
                    console.log(data);
                    data = JSON.parse(data);
                    console.log(data.isRegister);
                    if(data.isRegister == false)
                    {
                        $infoE = data.error;
                        var error = $(".error");

                        for(var i = 0 ; i<= error.length ;i++)
                        {
                            var s = $infoE[i];
                            error[i].innerText = s;
                        }
                    }
                    else
                    {
                        $("#register").modal("toggle");
                        Swal.fire(
                            {
                                type: "succes",
                                title: "Đăng ký thành công",
                                onClose: () => {
                                    window.location.reload();
                                    }
                            }
                        )
                    }
                    
                }
            })
        });

        $(document).on("click",".sub-item",function()
        {   
            $brand = $(this).attr("brand");
            $cetorgry = $(this).attr("cetorgry");
            if($brand != undefined || $cetorgry != undefined)
            {
               URLpush(GetURLParameter('search'),$brand,$cetorgry);
            }
            else{
                URLpush();
            }
            load_data();
            
        })
        
        $(document).on("change","#sortByselect",function()
        {
            load_data();
        })

        $(document).on("click",".changeUpIn",function()
        {
            // alert("click");
            $("#login").modal("toggle");
            $("#register").modal("toggle");
        });
    });

    
    $(document).ready(function(){
        $(document).on('click','.plus',function() //dấu + tăng số lượng
        {
            // alert("click");
            if($('.quality').val() == $('.quality').attr("max")) //kiểm tra số lượng trước khi tăng: nếu hiện tại số lượng bằng max rồi thì thông báo, không tăng thêm
            {
                alert("Không đủ hàng !!");
                return;
            }
            $('.quality').val(parseInt($('.quality').val()) + 1 );
        });
        $(document).on('click','.minus',function() //dấu - giảm số lượng
        {
            $('.quality').val(parseInt($('.quality').val()) - 1 );
            // alert("click");
            if ($('.quality').val() == 0) //giảm mà = 0 thì vẫn là 1
            {
                $('.quality').val(1);
                }
            });
        $("input[name='quant']").change(function()
        {
            if($('.quality').val() >= $('.quality').attr("max"))
            {
                alert("Không đủ hàng !!");
                $('.quality').val($('.quality').attr("max"));
                return;
            }
        });
    });

    $("")

// FUNCTION   
    
    function loginSuccess()
    {
        Swal.fire(
            {
            type : "success",
            title :'Đăng nhập thành công!',
            html:'Cửa sổ sẽ đóng trong <strong></strong> seconds.<br/><br/>',
            timer: 5000,
            onBeforeOpen: () => {
                timerInterval = setInterval(() => {
                    Swal.getContent().querySelector('strong')
                      .textContent = (Swal.getTimerLeft() / 1000)
                        .toFixed(0)
                  }, 100)
                },
            onClose: () => {
                clearInterval(timerInterval)
                window.location.reload();
                }
            }
        )
    }

    function SuggestLogin()
    {
        Swal.fire(
            {
            type : "warning",
            title : "Vui lòng đăng nhập trước khi mua ",
            onClose: () => {
                $("#login").modal("toggle"); //hiển thị form đăng nhập
                }
            }
        )
    }

    function sweetAlert(type,message)
    {
        Swal.fire(
            {
                type: type,
                title: message,
            }
        )
    }
    function reloadAfterAlert(type,message)
    {
        Swal.fire(
            {
            type : type,
            title : message,
            onClose: () => {
                window.location.reload();
                }
            }
        )
    }

    function GetURLParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('?');
        for (var i = 0; i < sURLVariables.length; i++){
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam)
            {
                return sParameterName[1];
            }
        }
    }
    function URLpush(search,brand,cetorgry)
    {
        $oldUrl = "index.php";
    
        $search = search === undefined ?"":"?search="+search;
        $brand = brand === undefined ?"":"?brand="+brand;
        $cetorgry = cetorgry === undefined ?"":"?cetorgry="+cetorgry;
    
        console.log($search);
        console.log($brand);
        console.log($cetorgry);
    
        $newURL  = $oldUrl + $search + $brand + $cetorgry;
        
        window.history.pushState("String","",$newURL);
    
    }
    
    $(document).on("submit","#editUser",function(event)
    {
        event.preventDefault();

        $userId = $(this).find('input[name="userId"]').val();  
        $firstName = $(this).find('input[name="firstName"]').val();  
        $lastName = $(this).find('input[name="lastName"]').val();  
        $email = $(this).find('input[name="email"]').val();  

        console.log($userId);

        $do = "editUser";
        $.ajax({
            url :"./dashboard/XuLy/userSetting.php",
            method:"POST",
            data : {userId: $userId , 
                    do : $do ,
                    firstName : $firstName ,
                    lastName : $lastName ,
                    email : $email},
            success:function(data)
            {
                console.log(data);
                data = JSON.parse(data);
                if(data.complete == true)
                {
                    reloadAfterAlert("success","Sửa thành công")
                }
                else
                {
                    $(".editUser-error").html(data.error);
                }
            }
        })
    })

    $(document).on("submit","#changePass",function(event)
    {
        event.preventDefault();

        $userId = $(this).find('input[name="userId"]').val();  
        $userName = $(this).find('input[name="userName"]').val();  
        $oldPass = $(this).find('input[name="oldPass"]').val();  
        $newPass = $(this).find('input[name="newPass"]').val();  
        $confirmPass = $(this).find('input[name="confirmPass"]').val();  

        console.log($userName);
        console.log($userId);

        $do = "changePass";
        $.ajax({
            url :"./dashboard/XuLy/userSetting.php",
            method:"POST",
            data : {userId: $userId , 
                    do : $do ,
                    userName: $userName ,
                    oldPass : $oldPass ,
                    newPass : $newPass ,
                    confirmPass : $confirmPass},
            success:function(data)
            {
                console.log(data);
                data = JSON.parse(data);
                if(data.complete == true)
                {
                    sweetAlert("success","Mật khẩu đã thay đổi");
                    $("#changePass").modal("toggle");
                }
                else
                {
                    $(".changePass-error").html(data.error);
                }
                // window.location.reload();
            }
        })
    })


    