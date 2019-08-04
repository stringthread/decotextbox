var code_cursor='<span id="cursor">|</span>';
var sel_s;
var tool_using=false;
var before_input=new Array();
function onInputChange(){
  $('#output').children().remove();
  var code_output='<div class="line">';
  var n=0;
  var per=false;
  var b=false;
  var i=false;
  var u=false;
  var c=false;
  $('#input').val().split('').forEach((e)=>{
    if(e=='\n'||e=='\r\n'||e=='\r'){
      code_output+='</div><div class="line"><span class="letter" data-n='+n+'></span>';
    }else if(e=='%'){
      if(per)code_output+='<span class="letter'+(b?' b':'')+(i?' i':'')+(u?' u':'')+(c?' c':'')+'" data-n='+n+'>'+e+'</span>';
      per=!per;
    }else if(per&&e=='b'){
      b=!b;
      per=false;
    }else if(per&&e=='i'){
      i=!i;
      per=false;
    }else if(per&&e=='u'){
      u=!u;
      per=false;
    }else if(per&&e=='c'){
      c=!c;
      per=false;
    }else {
      code_output+='<span class="letter'+(b?' b':'')+(i?' i':'')+(u?' u':'')+(c?' c':'')+'" data-n='+n+'>'+e+'</span>';
    }
    n++;
  });
  code_output+='</span>';
  $('#output').html(code_output);
  sel_s=$('#input').get(0).selectionStart;
  if($('#input').is(':focus')){
    if(sel_s==0){
      $(code_cursor).prependTo('#output');
    }else{
      $(code_cursor).insertAfter('.letter[data-n='+(sel_s-1)+']');
    }
  }
}

$(()=>{
  $(code_cursor).prependTo('#output');
  $('#output').on('mousedown','.letter',(e)=>{
    $('.letter').removeClass('sel');
    sel_s=parseInt($(e.currentTarget).attr('data-n'),10);
  });
  $('#output').on('mouseup','.letter',(e)=>{
    var n=parseInt($(e.currentTarget).attr('data-n'),10);
    if(sel_s!=n){
      var sel_min=Math.min(sel_s,n);
      var sel_max=Math.max(sel_s,n)
      $('#input').focus().get(0).setSelectionRange(sel_min,sel_max);
      for (var i = sel_min; i < sel_max; i++) {
        $('.letter[data-n='+i+']').addClass('sel');
      }
    }else{
    $('#input').focus().get(0).setSelectionRange(n+1,n+1);
  }
    $('#cursor').insertAfter('.letter[data-n='+n+']');
  });
  $('#output').click((e)=>{
    if($('#input').val()=='')$('#input').focus();
  });

  $('#input').on('keyup',(e)=>{
    for(var i=sel_s;i<Math.min($('#input').val().length,before_input.length);i++){
      if(before_input[i]!=$('#input').val().slice(i,i+1)){
        if(before_input[i]=='%'){
          if(before_input[i-1]=='%')before_input[i-1]='';
          if(before_input[i+1]=='%')before_input[i+1]='';
          $('#input').val(before_input.join(''));
        }else if($('#input').val().slice(i,i+1)=='%'){
          var tmp_input=$('#input').val().slice(0,i);
          tmp_input+='%';
          tmp_input+=$('#input').val().slice(i+1);
          $('#input').val(tmp_input);
        }
      }
    }
    if($('#input').val().length!=before_input.length){
      if($('#input').val().length>before_input.length&&$('#input').val().slice(-1)=='%'){
        $('#input').val($('#input').val()+'%');
      }else if($('#input').val().length<before_input.length&&before_input[before_input.length-1]=='%'&&before_input[before_input.length-2]=='%'){
        $('#input').val($('#input').val().slice(0,-1));
      }
    }
    onInputChange();
    before_input=Array.from($('#input').val());
    tool_using=false;
  });
});
