/**
 * Withdraw all not yet accepted invitations on Linkedin. What is specially nice
 * if you accidentally invited all your contacts from another sources.
 * @usage
 * 1) Enter in https://www.linkedin.com/inbox/invitations/sent
 * 2) Paste this code on Chrome's JavaScript console
 * 3) Execute LW.init();
 * 4) Wait :P
 * @author <a href="mailto:241103@gmail.com">Bruno Souza</a>
 */
var LW = (function(){

    var
        // last windows processed
        __LAST_FATHER_WINDOW = window
        // number of runs (initializations)
        , __RUNS = 0
        // maximum number of list pages opened sequentialy
        , __SAFE_LIMIT = 2
        , __USED_LIMIT = 0
        // processes invitation page
        , _proccessInvitation = function($win) {
            var $windowElements = $win.document.querySelectorAll('.btn-quaternary')
                , wElementsLength = $windowElements.length
                , j
                , archiveIndex
                , canWithdraw = false;

            for (j = 0; j < wElementsLength; j++) {
                if ($windowElements[j].text == "Withdraw") {
                    canWithdraw = true;
                    $windowElements[j].click();
                    break;
                } else if ($windowElements[j].text == "Archive"){
                    archiveIndex = j;
                }
            }

            if (!canWithdraw) {
                console.log('WITHDRAW UNAVAILABLE, ARCHIVING!');
                $windowElements[archiveIndex].click();
            } else {
                console.log('WITHDRAW AVAILABLE, WITHDRAWING!');
            }

            setTimeout(function() {
                $win.close();
            }, 20000);
        },
        // initialize invitation lists page handling
        _initList = function($fatherWin) {
            var $elements = $fatherWin.document.querySelectorAll('.detail-link')
                , eLength = $elements.length
                , i;
            for (i = 0; i < eLength; i++) {
                (function() {
                    var $win = window.open($elements[i].href, "_blank", "width=600,height=600,menubar=yes,toolbar=yes");
                    $win.LW = LW;
                    $win.addEventListener('load', function() {
                        _proccessInvitation($win);
                    }, false);
                }());
            }
            $fatherWin.close();
        },
        // initialize
        _init = function() {
            __RUNS++;

            _initList(__LAST_FATHER_WINDOW);

            var $win = window.open("https://www.linkedin.com/inbox/invitations/sent?startRow="+(__RUNS*16)+"&subFilter=&keywords=&sortBy=", "_blank", "width=600,height=600,menubar=no,toolbar=no");
            $win.LW = LW;
            $win.addEventListener('load', function() {
                $win.LW.init();
            }, false);

            __LAST_FATHER_WINDOW = $win;
        };

    return {
        // initialize
        init: function() {
            __USED_LIMIT++;
            if (__USED_LIMIT > __SAFE_LIMIT) {
                setTimeout(function() {
                    __USED_LIMIT = 1;
                    _init();
                }, 90000);
            } else {
                _init();
            }
        }
    };
}());
