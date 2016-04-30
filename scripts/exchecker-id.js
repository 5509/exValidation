/*!
 * exchecker-ja
 *
 * @version   : 1.1
 * @author    : Perdana Adhitama
 * @copyright : 5509 (http://5509.me/)
 * @license   : The MIT License
 * @link      : http://5509.me/log/exvalidation
 * @modified  : 2016-04-22 16:46
 */
;(function($) {
  // Extend validation rules
  $.exValidationRules = $.extend($.exValidationRules, {
    chkrequired: [
      "Isi kolom ini",
      function(txt, t) {
        if ( $(t).hasClass("chkgroup") ) {
          var flag = 0;
          $("input,select",t).each(function() {
            if ( $(this).val().length > 0 ) flag++;
          });
          if ( txt && flag === $("input,select", t).length ) {
            if ( /^[ 　\r\n\t]+$/.test(txt) ) {
              return false;
            } else {
              return true;
            }
          }
        } else {
          if ( txt && txt.length>0 ) {
            if ( /^[ 　\r\n\t]+$/.test(txt) ) {
              return false;
            } else {
              return true;
            }
          }
        }
      }
    ],
    chkselect: [
      "Silakan pilih",
      function(txt, t) {
        if ( txt && txt.length>0 ) {
          if ( /^[ 　\r\n\t]+$/.test(txt) ) {
            return false;
          } else {
            return true;
          }
        }
      }
    ],
    chkretype: [
      "Isi yang anda masukkan berbeda",
      function(txt, t) {
        var elm = $("#" + $(t).attr("class").split("retype\-")[1].split(/\b/)[0]);
        if ( elm.hasClass("chkgroup") ) {
          var chktxt = $("input", elm), txt = $("input", t);
          for ( var i = 0, flag = false; i < chktxt.length; i++ ) {
            if ( chktxt[i].value === txt[i].value ) {
              flag = true;
            } else {
              flag = false;
              break;
            }
          }
          if ( flag ) return true;
        } else {
          return elm.val() == txt;
        }
      }
    ],
    chkemail: [
      "Isi dengan format email yang benar",
      /^(?:[^\@]+?@[A-Za-z0-9_\.\-]+\.+[A-Za-z\.\-\_]+)*$/
    ],
    chkhankaku: [
      "Karakter double-byte tidak dapat digunakan",
      /^(?:[a-zA-Z0-9@\<\>\;\:\[\]\{\}\|\^\=\/\!\*\`\"\#\$\+\%\&\'\(\)\,\.\-\_\?\\\s]*)*$/
    ], //"
    chkzenkaku: [
      "Masukkan karakter double-byte",
      /^(?:[^a-zA-Z0-9@\<\>\;\:\[\]\{\}\|\^\=\/\!\*\"\#\$\+\%\&\'\(\)\,\.\-\_\?\\\s]+)*$/
    ],
    chkhiragana: [
      "Masukkan karakter Hiragana",
      /^(?:[ぁ-ゞ]+)*$/
    ],
    chkkatakana: [
      "Masukkan karakter Katakana",
      /^(?:[ァ-ヾ]+)*$/
    ],
    chkfurigana: [
      "Masukkan karakter Furigana",
      /^(?:[ぁ-ゞ０-９ー～（）\(\)\d 　]+)*$/
    ],
    chknochar: [
      "Masukkan alfanumerik",
      /^(?:[a-zA-Z0-9]+)*$/
    ],
    chknocaps: [
      "Masukkan huruf kecil",
      /^(?:[a-z0-9]+)*$/
    ],
    chknumonly: [
      "Masukkan nomor",
      /^(?:[0-9]+)*$/
    ],
    chkmin: [
      " karakter minimal",
      function(txt, t) {
        if ( txt.length === 0 ) return true;
         var length = $(t).attr("class").match(/min(\d+)/) ? RegExp.$1 : null;
        return txt.length >= length;
      }
    ],
    chkmax: [
      " karakter maksimal",
      function(txt, t) {
        var length = $(t).attr("class").match(/max(\d+)/) ? RegExp.$1 : null;
        return txt.length <= length;
      }
    ],
    chkradio: [
      "Pilihlah",
      function(txt, t) {
        return $("input:checked",t).length>0;
      }
    ],
    chkcheckbox: [
      "Pilihlah",
      function(txt, t) {
        return $("input:checked",t).length>0;
      }
    ],
    chkzip: [
      "Masukkan kode pos",
      /^(?:\d{3}-?\d{4}$|^\d{3}-?\d{2}$|^\d{3}$)*$/
    ],
    chkurl: [
      "Masukkan URL",
      /^(?:(?:ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)*$/
    ],
    chktel: [
      "Masukkan nomor telepon",
      /^(?:\(?\d+\)?\-?\d+\-?\d+)*$/
    ],
    chkfax: [
      "Masukkan nomor Fax",
      /^(?:\(?\d+\)?\-?\d+\-?\d+)*$/
    ],
    chkfile: [
      "Pilih file",
      function(txt, t) {
        if ( txt && txt.length>0 ) {
          if ( /^[ 　\r\n\t]+$/.test(txt) ) {
            return false;
          } else {
            return true;
          }
        }
      }
    ]
  });
})(jQuery);

