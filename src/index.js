import { sync } from "./components/sync";
import(/* webpackChunkName:"async-banner" */"./components/banner/banner").then(_=>{
    _.default.init();
});
sync();