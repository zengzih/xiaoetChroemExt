<template>
    <div class="content">
        <div class="layout">
            <el-input placeholder="appid" v-model="appId"></el-input>
        </div>
        
        <div class="layout">
            <el-select v-model="selectVal">
                <el-option v-for="item in select" :key="item.route" :label="item.label" :value="item.route"></el-option>
            </el-select>
        </div>
        
        <div class="layout">
            <el-button type="primary" @click="handleRun">前往</el-button>
        </div>
    </div>
</template>

<script>

/*console.log('window:', window)
// eslint-disable-next-line no-undef
const select = window.getRouteConfig()
const [{ route }] = select;*/
export default {
    data() {
        return {
            select: [],
            selectVal: '',
            appId: "",
            chromePromise: null,
            oldAppId: ''
        };
    },
    
    async created() {
        this.getRouteConfig();
        // eslint-disable-next-line
        chrome?.runtime.onMessage.addListener(async (data) => {
            if (data.appId) {
                this.appId = data.appId;
                this.oldAppId = data.appId;
            }
        });
        this.getAppId();
    },
    
    methods: {
        getRouteConfig() {
            try {
                fetch('../static/routeConfig.json').then(async res=> {
                    const data = await res.text();
                    this.select = JSON.parse(data);
                    const [{ route }] = this.select;
                    this.selectVal = route;
                })
            } catch(e) {
                console.log(e)
            }
        },
        chromeTabs() {
            return new Promise((resolve) => {
                try {
                    // eslint-disable-next-line
                    chrome?.tabs.query({active: true, currentWindow: true}, (tabs) =>
                        resolve(tabs)
                    );
                } catch (e) {
                    console.log(e)
                }
            });
        },
        
        chromeSend(data) {
            // eslint-disable-next-line
            chrome?.runtime.sendMessage(data);
        },
        
        getLocationHost(location) {
            const match = location.match(/^https?.*\.com/);
            let host = "";
            if (match && match.length) {
                host = match[0];
            }
            return host;
        },
        
        getAppId() {
            this.chromeTabs().then(tabs => {
                const host = this.getLocationHost(tabs[0].url);
                if (host) {
                    const url = `${host}/xe.merchant-serve.shop_info.get/1.0.0`;
                    this.chromeSend({
                        url,
                        host,
                        created: true
                    });
                }
            });
        },
        
        handleRun() {
            let isChange = false;
            if (this.oldAppId && this.oldAppId !== this.appId) {
                isChange = true;
            }
            this.oldAppId = this.appId;
            this.chromeTabs().then(tabs => {
                const host = this.getLocationHost(tabs[0].url);
                if (host) {
                    const url = `${host}/xe.merchant-serve.shop_list.shop.choose/1.0.0?app_id=${this.appId}`;
                    this.chromeSend({
                        url,
                        host,
                        appId: this.appId,
                        isChange,
                        shopUrl: this.selectVal,
                    });
                }
            });
        },
    },
};
</script>

<style scoped lang="less">
.content {
    width: 200px;
    
    .layout {
        margin-bottom: 10px;
        
        .el-select {
            width: 100%;
        }
        
        button {
            width: 100%;
        }
    }
}
</style>
