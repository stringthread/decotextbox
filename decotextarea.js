var code_cursor='<span id="cursor">|</span>';
var sel_s;
var tool_using=false;
var before_input=new Array();
function onInputChange(){
  $('.dta_output').children().remove();
  var code_output='<div class="line">';
  var n=0;
  var per=false;
  var b=false;
  var i=false;
  var u=false;
  var c=false;
  $('.dta_input').val().split('').forEach((e)=>{
    if(e=='\n'||e=='\r\n'||e=='\r'){
      code_output+='</div><div class="line"><span class="dta_letter" data-n='+n+'></span>';
    }else if(e=='%'){
      if(per)code_output+='<span class="dta_letter'+(b?' b':'')+(i?' i':'')+(u?' u':'')+(c?' c':'')+'" data-n='+n+'>'+e+'</span>';
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
      code_output+='<span class="dta_letter'+(b?' b':'')+(i?' i':'')+(u?' u':'')+(c?' c':'')+'" data-n='+n+'>'+e+'</span>';
    }
    n++;
  });
  code_output+='</span>';
  $('.dta_output').html(code_output);
  sel_s=$('.dta_input').get(0).selectionStart;
  if($('.dta_input').is(':focus')){
    if(sel_s==0){
      $(code_cursor).prependTo('.dta_output');
    }else{
      $(code_cursor).insertAfter('.dta_letter[data-n='+(sel_s-1)+']');
    }
  }
}

$(()=>{
  $(code_cursor).prependTo('.dta_output');
  $('.dta_output').on('mousedown','.dta_letter',(e)=>{
    e.stopPropagation();
    $('.dta_letter').removeClass('sel');
    sel_s=parseInt($(e.currentTarget).attr('data-n'),10);
  });
  $('.dta_output').on('mouseup','.dta_letter',(e)=>{
    e.stopPropagation();
    var n=parseInt($(e.currentTarget).attr('data-n'),10);
    if(sel_s!=n){
      var sel_min=Math.min(sel_s,n);
      var sel_max=Math.max(sel_s,n)
      $('.dta_input').focus().get(0).setSelectionRange(sel_min,sel_max);
      for (var i = sel_min; i < sel_max; i++) {
        $('.dta_letter[data-n='+i+']').addClass('sel');
      }
    }else{
    $('.dta_input').focus().get(0).setSelectionRange(n+1,n+1);
  }
    $('#cursor').insertAfter('.dta_letter[data-n='+n+']');
  });
  $('.dta_output').on('mousedown','.line',(e)=>{
    e.stopPropagation();
    $('.dta_letter').removeClass('sel');
    sel_s=parseInt($(e.currentTarget).children('.dta_letter').last().attr('data-n'),10)+1;
  });
  $('.dta_output').on('mouseup','.line',(e)=>{
    e.stopPropagation();
    var n=parseInt($(e.currentTarget).children('.dta_letter').last().attr('data-n'),10)+1;
    if(sel_s!=n){
      var sel_min=Math.min(sel_s,n);
      var sel_max=Math.max(sel_s,n)
      $('.dta_input').focus().get(0).setSelectionRange(sel_min,sel_max);
      for (var i = sel_min; i < sel_max; i++) {
        $('.dta_letter[data-n='+i+']').addClass('sel');
      }
    }else{
    $('.dta_input').focus().get(0).setSelectionRange(n+1,n+1);
  }
    $('#cursor').insertAfter('.dta_letter[data-n='+n+']');
  });
  $('.dta_output').click((e)=>{
    if($('.dta_input').val()=='')$('.dta_input').focus();
  });

  $('.dta_input').on('input',(e)=>{
    if(!tool_using){
      for(var i=sel_s;i<Math.min($('.dta_input').val().length,before_input.length);i++){
        if(before_input[i]!=$('.dta_input').val().slice(i,i+1)){
          if(before_input[i]=='%'){
            if(before_input[i-1]=='%')before_input[i-1]='';
            if(before_input[i+1]=='%')before_input[i+1]='';
            $('.dta_input').val(before_input.join(''));
          }else if($('.dta_input').val().slice(i,i+1)=='%'){
            var tmp_input=$('.dta_input').val().slice(0,i);
            tmp_input+='%';
            tmp_input+=$('.dta_input').val().slice(i+1);
            $('.dta_input').val(tmp_input);
          }
        }
      }
      if($('.dta_input').val().length!=before_input.length){
        if($('.dta_input').val().length>before_input.length&&$('.dta_input').val().slice(-1)=='%'){
          $('.dta_input').val($('.dta_input').val()+'%');
        }else if($('.dta_input').val().length<before_input.length&&before_input[before_input.length-1]=='%'&&before_input[before_input.length-2]=='%'){
          $('.dta_input').val($('.dta_input').val().slice(0,-1));
        }
      }
    }
    onInputChange();
    before_input=Array.from($('.dta_input').val());
    tool_using=false;
  });
  $('.dta_input').on('keyup',(e)=>{
    onInputChange();
  });
});
