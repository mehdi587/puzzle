$(function() {
    const puzzlePieces = [
        { id: "piece1", width: 110, height: 110, top: 0, left: 0, img: "https://jeux-izi-morocco.com/wp-content/uploads/2024/07/puzzlepiece01.png" },
        { id: "piece2", width: 144, height: 144, top: 0, left: 77, img: "https://jeux-izi-morocco.com/wp-content/uploads/2024/07/puzzlepiece02.png" },
        { id: "piece3", width: 143, height: 144, top: 0, left: 188, img: "https://jeux-izi-morocco.com/wp-content/uploads/2024/07/puzzlepiece03.png" },
        { id: "piece4", width: 144, height: 144, top: 77, left: 0, img: "https://jeux-izi-morocco.com/wp-content/uploads/2024/07/puzzlepiece04.png" },
        { id: "piece5", width: 144, height: 143, top: 110, left: 110, img: "https://jeux-izi-morocco.com/wp-content/uploads/2024/07/puzzlepiece05.png" },
        { id: "piece6", width: 110, height: 143, top: 110, left: 221, img: "https://jeux-izi-morocco.com/wp-content/uploads/2024/07/puzzlepiece06.png" },
        { id: "piece7", width: 110, height: 143, top: 188, left: 0, img: "https://jeux-izi-morocco.com/wp-content/uploads/2024/07/puzzlepiece07.png" },
        { id: "piece8", width: 144, height: 144, top: 220, left: 77, img: "https://jeux-izi-morocco.com/wp-content/uploads/2024/07/puzzlepiece08.png" },
        { id: "piece9", width: 143, height: 144, top: 220, left: 188, img: "https://jeux-izi-morocco.com/wp-content/uploads/2024/07/puzzlepiece09.png" },
        { id: "piece10", width: 110, height: 143, top: 298, left: 0, img: "https://jeux-izi-morocco.com/wp-content/uploads/2024/07/puzzlepiece10.png" },
        { id: "piece11", width: 144, height: 110, top: 331, left: 77, img: "https://jeux-izi-morocco.com/wp-content/uploads/2024/07/puzzlepiece11.png" },
        { id: "piece12", width: 143, height: 110, top: 331, left: 188, img: "https://jeux-izi-morocco.com/wp-content/uploads/2024/07/puzzlepiece12.png" }
    ];

    let timer;
    let countdown = 3;

    startGame();

    $('.btn-replay').click(() => {
        resetGame();
        startGame();
    });

    $('.btn-validate').click(() => {
        validateGame();
    });

    $('.btn-exit').click(() => {
        if (window.history.length > 1) {
            window.history.back(); // Navigate back to the previous page
        } else {
            window.close(); // Attempt to close the window
        }
    });

    function startGame() {
        resetGame();
        placePiecesInBorder();
        $('#border').css('background-image', 'url("https://jeux-izi-morocco.com/wp-content/uploads/2024/07/image-du-puzzle-reconstitue.png")');
        startCountdown();
    }

    function resetGame() {
        $('#scatter-container').empty();
        $('.timer').text(countdown).show();
        clearTimeout(timer);
    }

    function startCountdown() {
        timer = setInterval(() => {
            countdown--;
            $('.timer').text(countdown);
            if (countdown === 0) {
                clearInterval(timer);
                scatterPieces();
                $('.timer').hide();
                countdown = 3;
                // Hide the background image from the border
                $('#border').css('background-image', '');
            }
        }, 1000);
    }

    function placePiecesInBorder() {
        $('#border').empty();
        puzzlePieces.forEach(piece => {
            const svgPiece = `<img id="placeholder-${piece.id}" class="border-svg" src="https://jeux-izi-morocco.com/wp-content/uploads/2024/07/svg-path-${piece.id.replace('piece', '')}.svg" style="width:${piece.width}px;height:${piece.height}px;top:${piece.top}px;left:${piece.left}px;">`;
            $('#border').append(svgPiece);
        });
    }

    function scatterPieces() {
        $('#scatter-container').empty();
        const shuffledPieces = shuffleArray(puzzlePieces.slice());  // Shuffle the pieces
        shuffledPieces.forEach(piece => {
            const scatterPiece = `<img id="${piece.id}" class="puzzle__item border-svg" src="https://jeux-izi-morocco.com/wp-content/uploads/2024/07/svg-path-${piece.id.replace('piece', '')}.svg" style="width:${piece.width}px;height:${piece.height}px;background-image:url('${piece.img}');">`;
            $('#scatter-container').append(scatterPiece);
            const pieceElement = $(`#scatter-container #${piece.id}`);
            pieceElement.css({
                top: Math.random() * ($('#scatter-container').height() - pieceElement.height()) + 'px',
                left: Math.random() * ($('#scatter-container').width() - pieceElement.width()) + 'px',
                position: 'absolute'
            });
        });
        makePiecesDraggable();
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function makePiecesDraggable() {
        $('#scatter-container img').draggable({
            containment: 'body',
            revert: "invalid"
        });

        $('#border img').droppable({
            accept: "#scatter-container img",
            drop: function(event, ui) {
                const droppedPiece = ui.helper;
                const target = $(this);
                const pieceId = droppedPiece.attr('id');
                const targetId = target.attr('id').replace('placeholder-', '');

                if (pieceId === targetId && isNear(droppedPiece, target)) {
                    droppedPiece.css({
                        top: target.css('top'),
                        left: target.css('left'),
                        position: 'absolute'
                    });
                    target.replaceWith(droppedPiece);
                    droppedPiece.draggable('disable');
                } else {
                    droppedPiece.animate({
                        top: Math.random() * ($('#scatter-container').height() - droppedPiece.height()) + 'px',
                        left: Math.random() * ($('#scatter-container').width() - droppedPiece.width()) + 'px',
                    }, 'slow', function() {
                        droppedPiece.appendTo('#scatter-container');
                    });
                }
            }
        });
    }

    function isNear(droppedPiece, target) {
        const tolerance = 20;
        const droppedOffset = droppedPiece.offset();
        const targetOffset = target.offset();
        const x = droppedOffset.left - targetOffset.left;
        const y = droppedOffset.top - targetOffset.top;
        return Math.abs(x) < tolerance && Math.abs(y) < tolerance;
    }

    function validateGame() {
        let allCorrect = true;
        $('#scatter-container img').each(function() {
            const piece = $(this);
            const pos = piece.position();
            const correctPiece = puzzlePieces.find(p => p.id === piece.attr('id'));
            if (Math.abs(pos.left - correctPiece.left) >= 20 || Math.abs(pos.top - correctPiece.top) >= 20) {
                allCorrect = false;
            }
        });
        if (allCorrect) {
            $('#border').css('background-image', 'url(https://jeux-izi-morocco.com/wp-content/uploads/2024/07/image-du-puzzle-reconstitue.png)');
            showModal('Congratulations! All the pieces are in the correct position.');
        } else {
            showModal('Some pieces are still incorrect!');
        }
    }

    function showModal(message) {
        const modal = document.getElementById('custom-modal');
        const modalMessage = document.getElementById('modal-message');
        modalMessage.textContent = message;
        modal.style.display = 'flex';
        if (isFullscreen) {
            openFullscreen();
        }
    }

    function hideModal() {
        const modal = document.getElementById('custom-modal');
        modal.style.display = 'none';
    }

    const modalOk = document.getElementById('modal-ok');
    modalOk.addEventListener('click', () => {
        hideModal();
        if (isFullscreen) {
            openFullscreen();
        }
    });

    const fullscreenPrompt = document.getElementById('fullscreen-prompt');
    const continueBtn = document.getElementById('continue-btn');

    function showFullscreenPrompt() {
        fullscreenPrompt.style.display = 'flex';
    }

    function hideFullscreenPrompt() {
        fullscreenPrompt.style.display = 'none';
    }

    continueBtn.addEventListener('click', function() {
        hideFullscreenPrompt();
        openFullscreen();
    });

    function openFullscreen() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari, and Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
        }
        isFullscreen = true;
    }

    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari, and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
        isFullscreen = false;
    }

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            isFullscreen = false;
        }
    });
    document.addEventListener('webkitfullscreenchange', () => {
        if (!document.webkitFullscreenElement) {
            isFullscreen = false;
        }
    });
    document.addEventListener('mozfullscreenchange', () => {
        if (!document.mozFullScreenElement) {
            isFullscreen = false;
        }
    });
    document.addEventListener('msfullscreenchange', () => {
        if (!document.msFullscreenElement) {
            isFullscreen = false;
        }
    });

    // Initialize the first slide and show the fullscreen prompt
    showFullscreenPrompt();
});
