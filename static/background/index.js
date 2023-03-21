// eslint-disable-next-line
chrome?.runtime.onMessage.addListener(async (data, sender, sendResponse) => {
    const { url, host, shopUrl, created } = data;
    return fetch(url).then(async res=>  {
        const resp = await res.text();
        const { code, data }  = JSON.parse(resp);
        if (!code) {
            if (created) {
                const { diy_host } = data;
                const match = diy_host.match(/\/\/(.*?)\./);
                if (match && match.length > 1) {
                    // eslint-disable-next-line
                    chrome?.runtime.sendMessage({ appId: match[1] })
                }
            } else {
                // chrome.tabs.create({ url: host + `/${shopUrl}` })
                // eslint-disable-next-line
                chrome?.tabs.update(undefined, { url: `${host}/${shopUrl}` })
            }
        }
    })
});
