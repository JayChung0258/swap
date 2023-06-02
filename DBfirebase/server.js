const express = require('express');
const cors = require('cors');
const server = express();
const bodyParser = require('body-parser');
server.use(bodyParser.json());
server.use(cors());
var admin = require("firebase-admin");

var serviceAccount = require("./nccu-swap-firebase-adminsdk-3ga3a-df3a1b1462.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://nccu-swap-default-rtdb.asia-southeast1.firebasedatabase.app"
});
const database = admin.database();
const ref = database.ref("AnnouncementBoard");

server.get('/firebase/get', (request, response) => {


    ref.once("value", (snapshot) => {
        const data = snapshot.val();

        response.send(data)
    }).catch((error) => {
        response.send(error)
    }).finally(() => {

    });
})

server.post('/firebase/post', (request, response) => {
    //TODO setData資料可以從 request 來
    console.log(request)
    const setData = request.body
    // push才不會蓋掉原有資料
    const newRef = database.ref("AnnouncementBoard").push();
    newRef.set(setData).then((data) => {
        response.send(`set data  ok`);

    }).catch((error) => {
        response.send(error)
    });

})

server.put('/firebase/update', (request, response) => {
    const newData = {
        walletAddress: "0x1234567890",
        contractAddress: "LLLFGG",
        tokenId: "123"
    };
    // TODO key 改從 request 來
    const key = "-NWmG8kGMpIcYoi9yjyI";
    const dataRef = database.ref(`AnnouncementBoard/${key}`);
    dataRef.update(newData)
        .then(() => {
            response.send("資料更新成功");

        })
        .catch((error) => {
            response.send("資料更新失敗");
        });
})

server.delete('/firebase/remove', (request, response) => {

    // TODO key 改從 request 來
    const key = "-NWmG8kGMpIcYoi9yjyI";
    const dataRef = database.ref(`AnnouncementBoard/${key}`);
    dataRef.remove()
        .then(() => {
            response.send("資料刪除成功");
        })
        .catch((error) => {
            response.send("資料刪除失敗");
        });
})

server.get('/test', (request, response) => {
    response.send(`<h1>Hello, Node</h1>`)
})

// 監聽 port

const port = process.env.port || 3001;
server.listen(port)