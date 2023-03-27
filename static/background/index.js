
// eslint-disable-next-line
chrome?.runtime.onMessage.addListener(async (data, sender, sendResponse) => {
    console.log(chrome, sender, sendResponse);
    const { url, host, shopUrl, created, isChange } = data;
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
                if (isChange) {
                    // eslint-disable-next-line 
                    chrome?.tabs.update(undefined, { url: `${host}/t/merchant/index` });
                    // eslint-disable-next-line 
                    chrome?.tabs.onUpdated.addListener((tabId, changeInfo, tab)=> {
                        if (/merchant\/index/.test(changeInfo.url)) {
                            // eslint-disable-next-line 
                            chrome?.tabs.update(undefined, { url: `${host}/${shopUrl}` })
                        }
                    })
                } else {
                    // eslint-disable-next-line
                    chrome?.tabs.update(undefined, { url: `${host}/${shopUrl}` })
                }
            }
        }
    })
});
