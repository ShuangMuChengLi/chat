/**
 * Created by gequn06 on 2017/2/27.
 */
var source=new EventSource("/serverSent");
source.onmessage=function(event)
{
    document.getElementById("result").innerHTML+=event.data + "<br>";
};