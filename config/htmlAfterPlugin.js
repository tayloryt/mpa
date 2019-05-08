const pluginName = 'htmlAfterPlugin';
const assetsHelp = (data)=>{
    console.log("============"+data.css)
    let css= [],js = [];
    const dir = {
        js:item=>`<script src=${item}></script>`,
        css:item=>`<link rel='stylesheet' href=${item}>`
    }
    for(let jsitem of data.js){
        js.push(dir.js(jsitem))
    }
    for(let cssitem of data.css){
        console.log("得到的css:"+data.css)
        css.push(dir.css(cssitem))
    }
    return {
        js,
        css
    }
}
class HtmlAfterPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap(pluginName, compilation => {
            compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap(pluginName,htmlPluginData=>{
                let _html = htmlPluginData.html;
                _html = _html.replace(/widgets:/g,"../../../");
                const result = assetsHelp(htmlPluginData.assets);
                _html = _html.replace("<!--injectcss-->",result.css.join(""));
                _html = _html.replace("<!--injectjs-->",result.js.join(""));
                htmlPluginData.html = _html;
            })
        });
    }
}
module.exports = HtmlAfterPlugin;