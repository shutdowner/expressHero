# Order
## orderList 获取订单列表
### Note
* 按状态分
    未接(-1),已接(0),完成,(1)
* 按学校分
    应提供 学校ID(schoolID),返回规则按预计时间先后返回,原则上和当前时间的关系为[-1,+),单位:天

### Request
    POST 1.1/functions/orderList HTTP/1.1
    Payload
    {
        "sessionToken": "qq4yrxktoo0nww23gy85kodak",
        "status":"0",  // -1 0 1
        "school":"56cb0af371cfe40054e15791" //示例
    }
### Response
    Content-Type:application/json; charset=UTF-8

    {
     "result": {
        {
            "id":"56cc5b41c4c9710057de6375",
            "time":"2016-02-23 20:58:23",
            "com":"申通",
            "reward":30
        },
        {...}
     }
    }

## orderInfo 获取订单详情
### Request
    POST 1.1/functions/orderInfo HTTP/1.1
    Payload
    {
        "sessionToken": "qq4yrxktoo0nww23gy85kodak",
        "orderID": "56cc5b41c4c9710057de6375"
    }
### Response
    Content-Type:application/json; charset=UTF-8

    {
      "result": [
        {
          "order": {
            "orderid": "56cc5b41c4c9710057de6375",
            "expressID": "123456789012345",
            "expressCompany": "申通",
            "expressTime": "2016-02-23T12:58:23.000Z",
            "orderInfo": "礼物",
            "orderScore": 30,
            "orderStatus": true,
            "other": {
              "expressCarrier": {
                "userid": "56cd857d7db2a262291957ec",
                "username": "test"
              },
              "publisher": {
                "userid": "56cd857d7db2a262291957ec",
                "username": "test"
              },
              "school": {
                "schoolid": "56cb0af371cfe40054e15791",
                "schoolName": "湖南女子学院"
              },
              "location": {
                "locationid": "56cb2946efa631005c3ca81b",
                "spot": "正门口"
              }
            }
          }
        }
      ]
    }

## orderPublish 发单
### Request
    POST 1.1/functions/orderPublish HTTP/1.1
    Payload
    {
        "sessionToken":"32521pxen1hrvarqt1xmvw5kr",
        "expressID":"123456789012345",
        "expressTime":"2016-02-23 20:58:23",
        "expressCompany":"申通",
        "orderScore":30,
        "orderInfo":"礼物",
        "locationID":"56cb2946efa631005c3ca81b" //先用这个，之后调用API得到
    }
### Response
    Content-Type:application/json; charset=UTF-8

    {
      "result": {
        "ret": "success",
        "order": "56cc5b41c4c9710057de6375"
      }
    }

## orderCarrier 接单
### Request
    POST /1.1/functions/orderCarrier HTTP/1.1
    Payload
    {
        "sessionToken":"32521pxen1hrvarqt1xmvw5kr",
        "orderID":"56cc5b41c4c9710057de6375"
    }
### Response
    Content-Type: application/json; charset=UTF-8

    {
      "result": {
        "ret": "success",
        "order": "56cc5b41c4c9710057de6375"
      }
    }

## orderComplete 交单
### Request
    POST /1.1/functions/orderComplete HTTP/1.1
    Payload
    {
        "sessionToken":"32521pxen1hrvarqt1xmvw5kr",
        "orderID":"56cc5b41c4c9710057de6375"
    }
### Response
    Content-Type: application/json; charset=UTF-8

    {
      "result": {
        "ret": "success",
        "order": "56cc5b41c4c9710057de6375"
      }
    }

## todo
- [ ] orderCarrier判断