import request from "../../utils/request";
import getStorage from "../../utils/getStorage";

Component({
    properties: {
        orderId: {
            type: Number,
            value: 0
        },
        title: {
            type: String,
            value: 'title'
        },
        progress: {
            type: Number,
            value: 0
        },
        time_start: {
            type: String,
            value: 'time_start'
        },
        time_distribution: {
            type: String,
            value: 'time_distribution'
        },
        solver: {
            type: String,
            value: 'solver'
        },
        time_end: {
            type: String,
            value: 'time_end'
        }
    },

    data: {
        status: ['审核不通过', '已取消', '待审核', '待处理', '已完成'],
        color: ['_two', '_one', 'zero', 'one', 'two']
    },

    methods: {
        cancelOrder: async function (event) {
            let id = event.currentTarget.id;
            let userInfo = getStorage('localUserInfo');
            let token = userInfo.token;
            let res = await request('/updateOrder', 'POST',
                {
                    token,
                });
        }
    }

});
