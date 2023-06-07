<template>
    <div class="content">
        <div>
            <el-input placeholder="app_id" v-model="appId"></el-input>
        </div>
        <div class="flex">
            <el-button @click="handleStart" type="primary">开始</el-button>
            <el-button @click="handleStop" type="danger">停止</el-button>
        </div>
    </div>
</template>

<script>

// const sleep = (timeout=3)=> new Promise(resolve => setTimeout(()=> resolve(), timeout * 1000));

export default {
    data() {
        return {
            appId: "wxb0b1c856badd2aa6",
            chromePromise: null,
            oldAppId: '',
            status: 'start',
            timer: null,
            timer1: null
        };
    },

    async created() {
        // eslint-disable-next-line
        chrome?.runtime.onMessage.addListener(async ({ type, data }) => {
            if (type === 'video') {
                const { code, spuIds=[] } = data;
                if (code === 0) {
                    this.updateGoodsStatus(spuIds);
                    return this.$notify.success('添加成功')
                }
                this.$notify.error('添加失败')
            }
        });
    },

    mounted() {
        this.chromeGetGoodsId();
    },

    methods: {
        reload() {
            document.onreadystatechange = () => {
                if (document.readyState === 'complete') {
                    this.timer = setInterval(()=>{
                        window.location.reload();
                    }, 1000 * 60); //60秒刷新一次
                }
            };
        },

        getCookie(prop) {
            const cookies = document.cookie?.split(';');
            for (const i in cookies) {
                const [key, value] = cookies[i].trim().split('=');
                if (key === prop) {
                    return value;
                }
            }
            return '';
        },

        async chromeGetGoodsId() {
            return new Promise(resolve => {
                fetch(`https://wxshop.inside.xiaoeknow.com/xe.emarket/chrome_get_goods_id/1.0.0?video_shop_id=${this.appId}`, {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(async res=> {
                    const resp = await res.text();
                    const data = JSON.parse(resp);
                    resolve(data);
                })
            });
        },

        handleStart() {
            this.reload();
            const loopFetch = async ()=> {
                const { data=[] } = await this.chromeGetGoodsId();
                if (!data.length) {
                    this.handleStop();
                    return this.chromeSend({ type: 'notify', message: '暂无商品数据' });
                }
                const data_token = this.getCookie('data_token');
                const params = {"headSupplierId":"25984988208090242","startTime":5,"endTime":4294967290,"list":[]};
                data.forEach(({ wx_product_id: spuId, head_supplier_commission: serviceRatio, goods_commission: ratio })=> {
                    params.list.push({spuId, ratio: Number(ratio) * 10000, serviceRatio: Number(serviceRatio) * 10000 })
                });
                const url = `https://channels.weixin.qq.com/shop-faas/mmchannelstradeleague/headSupplier/cgi/batchAddHeadSupplierItem?token=${data_token}&lang=zh_CN`
                this.chromeSend({ url, params });
                // update goods status
            };
            clearInterval(this.timer1);
            this.timer1 = setInterval(()=> loopFetch(), 3000)
        },

        updateGoodsStatus(spuIds) {
            for (const i in spuIds) {
                const spuId = spuIds[i];
                if (spuId) {
                    const url = `https://wxshop.inside.xiaoeknow.com/xe.emarket/chrome_update_goods_head_supplier/1.0.0?wx_product_id=${spuId}&head_supplier_state=2`
                    fetch(url,  {
                        method: 'get',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                }
            }
        },

        handleStop() {
            clearInterval(this.timer)
            clearInterval(this.timer1)
        },

        chromeSend(data) {
            // eslint-disable-next-line
            chrome?.runtime?.sendMessage(data);
        }
    },
};
</script>

<style scoped lang="less">
.content {
    width: 400px;
    &>div {
        width: 100%;
    }
    .flex {
        margin-top: 10px;
        display: flex;
        button {
            flex: 1;
        }
    }
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
