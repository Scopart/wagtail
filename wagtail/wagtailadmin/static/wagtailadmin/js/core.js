/* generic function for adding a message to message area through JS alone */
function addMessage(status,text){
    $('.messages').addClass('new').empty().append('<ul><li class="' + status + '">' + text + '</li></ul>');
    var addMsgTimeout = setTimeout(function(){
        $('.messages').addClass('appear');
        clearTimeout(addMsgTimeout);
    }, 100);
}

$(function(){
    // Add class to the body from which transitions may be hung so they don't appear to transition as the page loads
    $('body').addClass('ready');

    // Enable toggle to open/close nav
    $(document).on('click', '#nav-toggle', function(){
        $('body').toggleClass('nav-open');
        if(!$('body').hasClass('nav-open')){
            $('body').addClass('nav-closed');
        }else{
            $('body').removeClass('nav-closed');
        }
    });

    // Resize nav to fit height of window. This is an unimportant bell/whistle to make it look nice
    var fitNav = function(){
        $('.nav-wrapper').css('min-height',$(window).height());
        $('.nav-main').each(function(){
            var thisHeight = $(this).height();
            var footerHeight = $('.footer', $(this)).height();
        });
    };
    fitNav();
    $(window).resize(function(){
        fitNav();
    });

    // Apply auto-height sizing to text areas
    // NB .richtext (hallo.js-enabled) divs do not need this as they expand to fit their content by default
    // $('.page-editor textarea').autosize();

    // Enable nice focus effects on all fields. This enables help text on hover.
    $(document).on('focus mouseover', 'input,textarea,select', function(){
        $(this).closest('.field').addClass('focused');
        $(this).closest('fieldset').addClass('focused');
        $(this).closest('li').addClass('focused');
    });
    $(document).on('blur mouseout', 'input,textarea,select', function(){
        $(this).closest('.field').removeClass('focused');
        $(this).closest('fieldset').removeClass('focused');
        $(this).closest('li').removeClass('focused');
    });

    /* tabs */
    $(document).on('click', '.tab-nav a', function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $(document).on('click', '.tab-toggle', function(e){
        e.preventDefault();
        $('.tab-nav a[href="'+ $(this).attr('href') +'"]').click();
    });

    $('.dropdown-toggle').bind('click', function(){
        $(this).closest('.dropdown').toggleClass('open');

        // Stop event propagating so the "close all dropdowns on body clicks" code (below) doesn't immediately close the dropdown
        return false;
    });

    /* close all dropdowns on body clicks */
    $(document).on('click', function(e){
        var relTarg = e.relatedTarget || e.toElement;
        if(!$(relTarg).hasClass('dropdown-toggle')){
            $('.dropdown').removeClass('open');
        }
    });

    /* Dropzones */
    $('.drop-zone').on('dragover', function(){
        $(this).addClass('hovered');
    }).on('dragleave dragend drop', function(){
        $(this).removeClass('hovered');
    });

    /* Header search behaviour */
    if(window.headerSearch){
        var search_current_index = 0;
        var search_next_index = 0;

        $(window.headerSearch.termInput).on('input', function() {
            clearTimeout($.data(this, 'timer'));
            var wait = setTimeout(search, 200);
            $(this).data('timer', wait);
        });

        // auto focus on search box
        $(window.headerSearch.termInput).trigger('focus');

        function search () {
            var workingClasses = "icon-spinner";

            $(window.headerSearch.termInput).parent().addClass(workingClasses);
            search_next_index++;
            var index = search_next_index;
            $.ajax({
                url: window.headerSearch.url,
                data: {q: $(window.headerSearch.termInput).val()},
                success: function(data, status) {
                    if (index > search_current_index) {
                        search_current_index = index;
                        $(window.headerSearch.targetOutput).html(data).slideDown(800);
                        window.history.pushState(null, "Search results", "?q=" + $(window.headerSearch.termInput).val());
                    }
                },
                complete: function(){
                    $(window.headerSearch.termInput).parent().removeClass(workingClasses);
                }
            });
        }
    }
});
