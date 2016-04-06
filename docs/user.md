# User
## register
### Request
    POST /1.1/functions/register HTTP/1.1
    Payload
        {
            "username":"test",
            "password":"test",
            "phone":"180-0000-0000"
        }
### Response
    Content-Type:application/json; charset=UTF-8

    {"result":{"stats":"success"}}

## login
### Request
   POST /1.1/functions/login HTTP/1.1
    Payload
        {
            "username":"test",
            "password":"test",
        }
### Response
    Content-Type:application/json; charset=UTF-8

    {
      "result": {
        "userid": "56cbcc572e958a00592c5aed",
        "sessionToken": "qq4yrxktoo0nww23gy85kodak",  //请求凭证，先放在request body，后续可能放到header
        "userinfo": {
          "username": "test",
          "email": "test@test.com",
          "bonusPoint": 10,
          "emailVerified": false,
          "complete": {
            "__type": "Relation",
            "className": "Order"
          },
          "mobilePhoneVerified": false
        }
      }
    }

## logout
### Request
   POST /1.1/functions/logout HTTP/1.1
    Payload
    {
        "sessionToken":"qq4yrxktoo0nww23gy85kodak"
    }
### Response
    Content-Type:application/json; charset=UTF-8

    {"result":{"stats":"success"}}

## userinfo (get)
### Request
    POST /1.1/functions/userinfo HTTP/1.1
    Payload
    {
        "userid":"56cd857d7db2a262291957ec"
    }
### Response
    Content-Type:application/json; charset=UTF-8

    {
      "result": {
        "userid": "56cd857d7db2a262291957ec",
        "sessionToken": "qq4yrxktoo0nww23gy85kodak",
        "userinfo": {
          "username": "test",
          "bonusPoint": 10,
          "phone": "180-0000-0000",
          "complete": {
            "__type": "Relation",
            "className": "Order"
          },
          "authData": null,
          "mobilePhoneVerified": false
        }
      }
    }

## todo
- [ ] 头像(999)
- [ ] 修改用户信息
- [ ] 密码重置
- [ ] 修改密码
- [ ] 手机号码一键登录
- [ ] ...