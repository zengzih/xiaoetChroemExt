const notify = (message) => {
    // eslint-disable-next-line
    const url = chrome.runtime.getURL('images/weChat.png')
    const notifyId = Math.random() + '';
    //创建一个通知面板
    // eslint-disable-next-line
    chrome.notifications.create(notifyId, {
        type: 'basic',
        iconUrl: url,
        title: '通知',
        message,
        eventTime: Date.now() + 1000
    });
}


// eslint-disable-next-line
chrome?.runtime.onMessage.addListener(async (data, sender, sendResponse) => {
    const { url, params, type, message } = data;
    if (type === 'notify') {
        return notify(message);
    }
    return fetch(url, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        mode: "cors",
        body: JSON.stringify(params)
    }).then(async res => {
        const resp = await res.text();
        const { code } = JSON.parse(resp);
        notify(code === 0 ? '添加成功' : '添加失败');
        const spuIds = params.list.map(({ wx_product_id })=> wx_product_id);
        // eslint-disable-next-line
        chrome?.runtime.sendMessage({ type: 'video', data, spuIds })
    })
});
