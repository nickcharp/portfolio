$(document).ready(function() {
    let isPlaying = false;
    let currentBeat = 0;
    let intervalId = null;
    let beatsPerMeasure = 4;
    let currentBpm = 120;
    let barCount = 0;
    let emphasisBeats = new Set();
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    function createCircles(num) {
        $('#circles').empty();
        emphasisBeats.clear();
        for (let i = 0; i < num; i++) {
            $('#circles').append(`<div class="circle" data-beat="${i}"></div>`);
        }
    }

    function playClick(frequency, isEmphasis) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = isEmphasis ? frequency * 1.2 : frequency;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    function updateMetronome() {
        $('.circle').removeClass('active');
        const $currentCircle = $(`.circle[data-beat="${currentBeat}"]`);
        $currentCircle.addClass('active');
        
        const tone = parseInt($('#tone').val());
        const isEmphasis = emphasisBeats.has(currentBeat);
        playClick(tone, isEmphasis);

        currentBeat = (currentBeat + 1) % beatsPerMeasure;
        
        if (currentBeat === 0) {
            barCount++;
            const barsPerChange = parseInt($('#bars').val());
            if (barCount >= barsPerChange) {
                adjustBpm();
                barCount = 0;
            }
        }
    }

    function adjustBpm() {
        const change = parseInt($('#bpmChange').val());
        const direction = $('#direction').val();
        
        // Only adjust BPM if change is greater than 0
        if (change > 0) {
            if (direction === 'increase' && currentBpm + change <= 500) {
                currentBpm += change;
            } else if (direction === 'decrease' && currentBpm - change >= 20) {
                currentBpm -= change;
            }
            $('#bpm').val(currentBpm);
            $('#bpmValue').text(currentBpm);
            if (isPlaying) {
                clearInterval(intervalId);
                intervalId = setInterval(updateMetronome, 60000 / currentBpm);
            }
        }
        // If change is 0, no adjustment happens
    }

    function resetMetronome() {
        currentBeat = 0;
        barCount = 0;
        $('.circle').removeClass('active');
    }

    // Initial setup
    createCircles(beatsPerMeasure);

    // Event handlers
    $('#startStop').click(function() {
        if (!isPlaying) {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            isPlaying = true;
            $(this).text('Stop');
            intervalId = setInterval(updateMetronome, 60000 / currentBpm);
        } else {
            isPlaying = false;
            $(this).text('Start');
            clearInterval(intervalId);
        }
    });

    $('#reset').click(function() {
        if (!isPlaying) {
            resetMetronome();
        }
    });

    $('#bpm').on('input', function() {
        currentBpm = parseInt($(this).val());
        $('#bpmValue').text(currentBpm);
        if (isPlaying) {
            clearInterval(intervalId);
            intervalId = setInterval(updateMetronome, 60000 / currentBpm);
        }
    });

    $('#timeSignature').change(function() {
        beatsPerMeasure = parseInt($(this).val());
        createCircles(beatsPerMeasure);
        currentBeat = 0;
        barCount = 0;
        if (!isPlaying) {
            resetMetronome();
        }
    });

    $(document).on('click', '.circle', function() {
        const beat = parseInt($(this).data('beat'));
        if (emphasisBeats.has(beat)) {
            emphasisBeats.delete(beat);
            $(this).removeClass('emphasis');
        } else {
            emphasisBeats.add(beat);
            $(this).addClass('emphasis');
        }
    });
});