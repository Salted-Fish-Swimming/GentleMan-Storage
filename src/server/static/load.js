const socket1 = new WebSocket('ws://localhost:3000');

socket1.onopen = async (event) => {
  console.log('socket1 connect success');
};

socket1.onmessage = async (event) => {
  const data = JSON.parse(event.data)
  const id = data.id;
  console.log(`socket1 message: ${data}`);
  const postdata = JSON.stringify({
    type: 'start',
    action: 'bind',
    id: id
  });
  const response = await fetch('/ws', {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'post',
    body: postdata,
  });
  const repdata = await response.json();
  console.log({data, postdata, repdata});
}

socket1.onclose = async (event) => {
  console.log('socket1 connect close');
}

// const socket2 = new WebSocket('ws://localhost:3000/a/b');

// socket2.onopen = (event) => {
//   console.log('socket2 connect success');
// };

// socket2.onmessage = (event) => {
//   console.log(`socket2 message: ${event.data}`);
// }

// socket2.onclose = (event) => {
//   console.log('socket2 connect close');
// }

fetch('/hello', { method: 'get' })
.then((response) => {
  return response.text();
})
.then((text) => {
  console.log(text);
});