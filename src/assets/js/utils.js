export default {
    // 防抖动，一段时间触发了多次，只执行最后一次
    debounce (func, delay) {
        let timer;
        return function(...args) {
            if(timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                func.apply(this, args)
            }, delay);
        }
    }
}