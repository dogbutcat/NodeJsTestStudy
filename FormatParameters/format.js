/**
 * Created by oliver on 5/5/16.
 */
var mainContent = 'DomainName=www.douyu.com&amp;cdn=&amp;asset_url=http://staticlive.douyutv.com/common/&amp;checkowne=0&amp;usergroupid=undefined&amp;uid=0&amp;room_link=&amp;Servers=%5B%7B%22ip%22%3A%22119.90.49.92%22%2C%22port%22%3A%228059%22%7D%2C%7B%22ip%22%3A%22119.90.49.94%22%2C%22port%22%3A%228066%22%7D%2C%7B%22ip%22%3A%22119.90.49.92%22%2C%22port%22%3A%228058%22%7D%2C%7B%22ip%22%3A%22119.90.49.102%22%2C%22port%22%3A%228008%22%7D%2C%7B%22ip%22%3A%22119.90.49.101%22%2C%22port%22%3A%228004%22%7D%2C%7B%22ip%22%3A%22119.90.49.94%22%2C%22port%22%3A%228067%22%7D%2C%7B%22ip%22%3A%22119.90.49.109%22%2C%22port%22%3A%228044%22%7D%2C%7B%22ip%22%3A%22119.90.49.109%22%2C%22port%22%3A%228042%22%7D%2C%7B%22ip%22%3A%22119.90.49.104%22%2C%22port%22%3A%228019%22%7D%2C%7B%22ip%22%3A%22119.90.49.101%22%2C%22port%22%3A%228001%22%7D%5D&amp;RoomId=339715&amp;RoomTitle=NB场次-马尼拉特锦赛中国区预选&amp;cate_id=3&amp;OwnerId=24166828&amp;Status=true&amp;closeFMS=false&amp;roompass=0&amp;isshow=0&amp;phonestatus=0&amp;WidgetUrl=http://s.csbew.com/FrameWork/AFP/ASP_vastTrack2.swf&amp;WidgetId=5322&amp;WidgetServers=http://afp.wasu.cn/&amp;WidgetPosition=0&amp;WidgetType=0&amp;effectConfig=%7B%22rocket%22%3A%7B%22sender_color%22%3A%22%23FF3739%22%2C%22receiver_color%22%3A%22%23FF3739%22%2C%22default_color%22%3A%22%23FFFFFF%22%2C%22bg_color%22%3A%22%23C1FFC1%22%2C%22swf_x%22%3A%220%22%2C%22swf_y%22%3A%220%22%2C%22font_x%22%3A%22153%22%2C%22font_y%22%3A%2250%22%2C%22swf%22%3A%22%22%7D%2C%22plane%22%3A%7B%22sender_color%22%3A%22%23FF3739%22%2C%22receiver_color%22%3A%22%23FF3739%22%2C%22default_color%22%3A%22%23FFFFFF%22%2C%22bg_color%22%3A%22%23C1FFC1%22%2C%22swf_x%22%3A%220%22%2C%22swf_y%22%3A%220%22%2C%22font_x%22%3A%22115%22%2C%22font_y%22%3A%2243%22%2C%22swf%22%3A%22%22%7D%7D&amp;flashConfig=%5B%7B%22gid%22%3A%2259%22%2C%22flag%22%3A%22douyu_gift_effect_7%22%2C%22font_size%22%3A%2217%22%2C%22name%22%3A%22%u706B%u7BAD%22%2C%22sender_color%22%3A%22%23ff3739%22%2C%22receiver_color%22%3A%22%23ff3739%22%2C%22default_color%22%3A%220x1D1D1D%22%2C%22swf_x%22%3A%22%22%2C%22swf_y%22%3A%22%22%2C%22font_x%22%3A%22153%22%2C%22font_y%22%3A%2250%22%7D%2C%7B%22gid%22%3A%2254%22%2C%22flag%22%3A%22douyu_gift_effect_5%22%2C%22font_size%22%3A%2217%22%2C%22name%22%3A%22%u98DE%u673A%22%2C%22sender_color%22%3A%22%23ff3739%22%2C%22receiver_color%22%3A%22%23ff3739%22%2C%22default_color%22%3A%220x1D1D1D%22%2C%22swf_x%22%3A%22%22%2C%22swf_y%22%3A%22%22%2C%22font_x%22%3A%22115%22%2C%22font_y%22%3A%2243%22%7D%5D&amp;effectSwf=http://staticlive.douyutv.com/upload/dygift/800bf9b93e1bf9f35eead86edd15214a.swf';
var result = [], splitCode = '&amp;', fs = require('fs'), filename = 'douyuFlashParameter.txt', resultFormat = [];
result = mainContent.split(splitCode);
for (var par in result) {
    resultFormat += result[par] + '&\n'
}
decode = require('./encodeDecode.js');
resultFormat = decode.UTF82Native(resultFormat);
WriteFile(filename, resultFormat, function (err) {
    if (err)throw err;
    console.log('it\'s Saved!');
})

fs.readFile('./pageVar.js', 'utf8', function (err, data) {
    if (err)throw err;
    resultFormat = decode.ascii2native(data);
    WriteFile('./pageVar.js',resultFormat,function (err) {
        if (err)throw err;
        console.log('Save2 Completed!')
    })
})

function WriteFile(a, b, c, d) {
    !d ? d = c : d;
    fs.writeFile(a, b, c, d);
}