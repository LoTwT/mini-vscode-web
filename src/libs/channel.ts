const wait: Record<number, any> = {};
export function invokeMain(channel: string, ...data: any[]) {
  const id = Math.random();
  let p = new Promise((resolve, reject) => {
    wait[id] = { resolve, reject };
  });
  window.postMessage({
    channel: 'ipc.call-' + channel,
    id,
    data
  });

  return p;
}

export function invokePre<T>(channel: string, ...data: any[]): Promise<T> {
  const id = Math.random();
  let p = new Promise<T>((resolve, reject) => {
    wait[id] = { resolve, reject };
  });
  window.postMessage({
    channel: 'ipc.pre-' + channel,
    id,
    data
  });

  return p;
}

























window.addEventListener('message', function (ev) {
  const { channel, ok, data, error, id } = ev.data;


  if (channel === 'ipc-result') {
    if (ok) {
      wait[id].resolve(data);
    } else {
      wait[id].reject(error);
    }
  }

});