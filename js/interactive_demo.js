var video1_path = '';
var video2_path = '';

var prev_video1_path = 'none';
var prev_video2_path = 'none';

/* Section 0: Qualitative Results Examples */

var selected_qual_example = 'example1';

/* Section 0.75: Two Objects Examples */

var selected_twoobj_example = 'example1';
var twoobj_name_map = {
    'example1': '453212399',
    'example2': '209777841',
    'example3': '3645'
};

function selectTwoObjectsExample(example) {
    selected_twoobj_example = example;
    updateTwoObjectsExample();
    showSelected();
}

function updateTwoObjectsExample() {
    var mediaName = twoobj_name_map[selected_twoobj_example] || '1';

    var leftVideo = document.getElementById('twoobj-left-player');
    var leftSrc = document.getElementById('twoobj-left-src');
    if (leftVideo && leftSrc) {
        leftVideo.pause();
        leftSrc.setAttribute('src', 'resources/2_object/input_video/' + mediaName + '.mp4');
        leftVideo.load();
        leftVideo.currentTime = 0;
        leftVideo.play();
    }

    var frameImg = document.getElementById('twoobj-frame');
    if (frameImg) {
        frameImg.src = 'resources/2_object/first_frame/' + mediaName + '.jpg';
    }

    var rightVideo = document.getElementById('twoobj-right-player');
    var rightSrc = document.getElementById('twoobj-right-src');
    if (rightVideo && rightSrc) {
        rightVideo.pause();
        rightSrc.setAttribute('src', 'resources/2_object/edit_video/' + mediaName + '.mp4');
        rightVideo.load();
        rightVideo.currentTime = 0;
        rightVideo.play();
    }
}

/* Section 0.5: Our Single Path Examples */

var selected_our_only_example = '';
var our_only_examples = [];
var our_only_prompts = {
    "1": "A child running in the living room",
    "2": "A bird flying a head of a cat",
    "3": "A child riding a bicycle,  mother running behind",
    "4": "A child ridding a scooter with father",
    "3363": "A girl ridding a bicycle, mother standing behind",
    "449960875": "A car running while a child walking",
    "455489627": "A woman walking in the beach",
    "516703313": "A cat play with an automatic vacuum cleaner",
    "210171600": "A man playing skateboard in the street"
};
var our_only_default_video_names = ['1', '2', '3','455489627', '3363', '449960875', '516703313', '210171600'];

function initOurOnlyExamples() {
    setupOurOnlyExamples(our_only_prompts);
}

function setupOurOnlyExamples(promptData) {
    our_only_prompts = {};
    our_only_examples = [];

    if (Array.isArray(promptData)) {
        for (var i = 0; i < promptData.length; i++) {
            var item = promptData[i];
            if (item && item.name_video && typeof item.text !== 'undefined') {
                var videoNameFromArray = String(item.name_video);
                our_only_prompts[videoNameFromArray] = String(item.text);
            }
        }
    } else if (promptData && typeof promptData === 'object') {
        for (var key in promptData) {
            if (Object.prototype.hasOwnProperty.call(promptData, key)) {
                var value = promptData[key];
                if (typeof value === 'string') {
                    our_only_prompts[key] = value;
                } else if (value && typeof value.text !== 'undefined') {
                    our_only_prompts[key] = String(value.text);
                } else {
                    our_only_prompts[key] = String(value);
                }
            }
        }
    }

    our_only_examples = Object.keys(our_only_prompts);
    if (!our_only_examples.length) {
        our_only_examples = our_only_default_video_names.slice();
    }

    // Stable ordering: numeric names first, then lexicographic.
    our_only_examples.sort(function (a, b) {
        var numA = Number(a);
        var numB = Number(b);
        var isNumA = !isNaN(numA);
        var isNumB = !isNaN(numB);
        if (isNumA && isNumB) {
            return numA - numB;
        }
        return a.localeCompare(b);
    });

    selected_our_only_example = our_only_examples[0] || '';
    renderOurOnlyButtons();
    updateOurOnlyExample();
    showSelected();
}

function renderOurOnlyButtons() {
    var buttonContainer = document.getElementById('our-only-buttons');
    if (!buttonContainer) {
        return;
    }

    buttonContainer.innerHTML = '';

    for (var i = 0; i < our_only_examples.length; i++) {
        var exampleName = our_only_examples[i];
        var wrapper = document.createElement('div');
        wrapper.className = 'column';

        var button = document.createElement('button');
        button.className = 'button btn-our-only-video';
        button.setAttribute('type', 'button');
        button.textContent = 'Example ' + (i + 1);
        button.setAttribute('data-example', exampleName);
        button.onclick = (function (name) {
            return function () {
                selectOurOnlyExample(name);
            };
        })(exampleName);

        wrapper.appendChild(button);
        buttonContainer.appendChild(wrapper);
    }
}

function selectOurOnlyExample(exampleName) {
    selected_our_only_example = exampleName;
    updateOurOnlyExample();
    showSelected();
}

function updateOurOnlyExample() {
    if (!selected_our_only_example) {
        return;
    }

    var promptDiv = document.getElementById('our-only-prompt');
    if (promptDiv) {
        var promptText = our_only_prompts[selected_our_only_example] || '';
        promptDiv.textContent = promptText;
    }

    var leftVideo = document.getElementById('our-only-video-left-player');
    var leftSrc = document.getElementById('our-only-video-left-src');
    if (leftVideo && leftSrc) {
        leftVideo.pause();
        leftSrc.setAttribute('src', 'resources/our_only/input_video/' + selected_our_only_example + '.mp4');
        leftVideo.load();
        leftVideo.currentTime = 0;
        leftVideo.play();
    }

    var rightVideo = document.getElementById('our-only-video-right-player');
    var rightSrc = document.getElementById('our-only-video-right-src');
    if (rightVideo && rightSrc) {
        var normalSrc = 'resources/our_only/edit_video/' + selected_our_only_example + '.mp4';
        var hoverSrc = 'resources/our_only/edit_video_box/' + selected_our_only_example + '.mp4';

        rightVideo.setAttribute('data-normal-src', normalSrc);
        rightVideo.setAttribute('data-hover-src', hoverSrc);

        if (!rightVideo.dataset.hoverBound) {
            rightVideo.addEventListener('mouseenter', function () {
                swapOurOnlyRightVideoSource(true);
            });
            rightVideo.addEventListener('mouseleave', function () {
                swapOurOnlyRightVideoSource(false);
            });
            rightVideo.dataset.hoverBound = '1';
        }

        swapOurOnlyRightVideoSource(false);
    }

    var firstFrameImg = document.getElementById('our-only-first-frame');
    if (firstFrameImg) {
        firstFrameImg.src = 'resources/our_only/first_frame/' + selected_our_only_example + '.jpg';
    }
}

function swapOurOnlyRightVideoSource(useHoverSource) {
    var rightVideo = document.getElementById('our-only-video-right-player');
    var rightSrc = document.getElementById('our-only-video-right-src');
    if (!rightVideo || !rightSrc) {
        return;
    }

    var targetSrc = useHoverSource
        ? rightVideo.getAttribute('data-hover-src')
        : rightVideo.getAttribute('data-normal-src');

    if (!targetSrc || rightSrc.getAttribute('src') === targetSrc) {
        return;
    }

    rightVideo.pause();
    rightSrc.setAttribute('src', targetSrc);
    rightVideo.load();
    rightVideo.currentTime = 0;
    rightVideo.play();
}

var qual_prompts = {
    'example1': 'Happy child, girl with kite in her hands, runs across field on green grass in summer. Kid plays outdoors in park at sunset. Happy family, children dreams. Child playing in nature. Children holiday & good aesthetics',
    'example2': 'A Loggerhead Sea Turtle is seen swimming gracefully in the vibrant coral reef of the Caribbean Sea around Curacao. The turtle, with its distinctive greenish-brown shell and flippers, navigates through the colorful coral formations. The scene is set against a backdrop of clear blue water',
    'example3': 'A vibrant green parrot with a striking red beak and orange eyes perches gracefully on a slender tree branch. The parrot feathers are a rich, lush green, with hints of red and blue near its wings. The background is a dense, verdant forest, filled with various shades of green foliage that create a lush, natural canopy',
    'example4': 'A turtle gracefully swims in the clear, blue waters of a vibrant coral reef. The turtle shell, adorned with intricate patterns of brown and black, glistens under the sunlight filtering through the water. Surrounding the turtle are various corals and rocks, adding texture and color to the underwater landscape'
};

function selectQualExample(example) {
    selected_qual_example = example;
    updateQualExample();
    showSelected();
}




/* Section 1: Baseline Comparisons */

var selected_baseline_example = 'example1';

var baseline_prompts = {
    'example1': 'A beautiful sea turtle calmly swims in the turquoise blue ocean. The scene is captured in slow motion, showcasing the turtle graceful movements underwater. The underwater shot reveals the vibrant blue hues of the ocean, with the turtle\'s shell displaying a mix of dark and light patterns',
    'example2': 'A turtle gracefully swims in the clear, blue waters of a vibrant coral reef. The turtle shell, adorned with intricate patterns of brown and black, glistens under the sunlight filtering through the water. Surrounding the turtle are various corals and rocks, adding texture and color to the underwater landscape. The scene is bathed in natural light, creating a serene and picturesque underwater environment',
    'example3': 'Muscular, handsome man on a tropical, rocky beach - slow motion',
    'example4': 'A penguin stands on a rocky outcrop by the sea, with waves crashing against the rocks in the background. The penguin, with its distinctive black and white plumage, appears to be observing its surroundings. The scene is set against a backdrop of a turbulent ocean, with the penguin black and white contrasting sharply with the blue and white hues of the water and sky. The lighting suggests it might be either early morning or late afternoon, casting a soft glow on the scene',
    'example5': 'A snowplow truck is driving through a snowy forest at night, leaving a trail of freshly cleared snow behind. The truck is illuminated by its headlights, cutting through the darkness and revealing the dense coniferous trees lining the road. The sky is a deep blue, indicating it is late evening or nighttime',
    'example6': 'A radio-controlled jeep in khaki colors drives on autumn leaves in a forest. The jeep, a toy model of a Soviet military vehicle, maneuvers through a dense forest with a carpet of yellow and brown leaves. The scene is set outdoors, with tall trees and a clear blue sky in the background.',
    'example7': ''
};

var baseline_method_label_map = {
    'hunyuan': 'Hunyuan',
    'vace': 'VACE',
    'compositor': 'GenCompositor',
    'magic_motion': 'Magic Motion',
    'motion_canvas': 'Motion Canvas',
    'pisco': 'PISCO',
    'wan_move': 'Wan Move',
    'our': '  (Ours)'
};

var baseline_methods_by_example = {
    'default': ['hunyuan', 'vace', 'compositor', 'our']
};

var baseline_i2v_methods_by_example = {
    'default': ['magic_motion', 'wan_move', 'motion_canvas', 'pisco']
};

function selectBaselineExample(example) {
    selected_baseline_example = example;
    updateBaselineExample();
    showSelected();
}

/* Section 2: Stage1 (Box Transformation) */

var selected_stage1_example = 'example1';

var stage1_prompts = {
    'example1': 'A young, active couple is jogging together in the mountains during the morning. They are dressed in athletic gear, with the woman wearing a pink sports bra and gray leggings, and the man in a green and black athletic outfit. The couple is running on a dirt path surrounded by lush greenery and majestic mountains in the background. The sky is partly cloudy, adding a dramatic backdrop to their workout',
    'example2': 'A snowplow truck is driving through a snowy forest at night, leaving a trail of freshly cleared snow behind. The truck is illuminated by its headlights, cutting through the darkness and revealing the dense coniferous trees lining the road. The sky is a deep blue, indicating it\'s late evening or nighttime. The truck is moving steadily along the winding road, surrounded by a serene winter landscape',
    'example3': 'A snowboarder in a vibrant yellow jacket and black pants is skillfully navigating down a snow-covered slope at a ski resort. The scene is set against a backdrop of dense evergreen trees and a vast, cloudy sky, with distant mountains visible in the horizon. The snowboarder\'s movements are fluid and controlled, showcasing their expertise in the sport.',
    'example4': 'Girl walking through the forest on the riverbank on a sunny summer day & fair aesthetics'
};

function selectStage1Example(example) {
    selected_stage1_example = example;
    updateStage1Example();
    showSelected();
}

/* Section 3: Stage2 */

var selected_stage2_example = 'example1';

var stage2_prompts = {
    'example1': 'A large tractor with a trailer moves across a golden wheat field, collecting straw. Harvesters are actively harvesting the ripe wheat grain, creating a bustling scene of agricultural activity. The tractor, with its robust red and green color scheme, is seen pulling a trailer filled with harvested straw, while another tractor in the background is also engaged in the harvesting process',
    'example2': 'A young girl with her hair tied up in pigtails is joyfully running and playing in the city center near a fountain. She is wearing a blue sleeveless top, a white skirt with pink trim, and black shoes. The background features a bustling urban environment with buildings, cars, and a clear blue sky',
    'example3': 'Goats running to the farm from pasture. Herd of goats are on country road. Goat farming business. & fair aesthetics',
    'example4': 'A black border collie is energetically running across a lush green field bordered by trees in Ireland. The dog is captured in a full shot, showcasing its agility and vitality as it dashes through the grass. The background features a serene landscape with dense trees, creating a picturesque and tranquil setting. The scene is bathed in natural light, highlighting the vibrant green of the grass and the rich brown tones of the trees',
    'example5': '',
    'example6': '',
    'example7': '',
    'example8': '',
    'example9': '',
    'example10': ''
};

var stage2_method_label_map = {
    'hunyuan': 'Hunyuan',
    'vace': 'VACE',
    'gencompositor': 'GenCompositor',
    'magic_motion': 'Magic Motion',
    'motion_canvas': 'Motion Canvas',
    'pisco': 'PISCO',
    'wan_move': 'Wan Move',
    'our': 'DynaEdit (Ours)'
};

var stage2_i2v_methods_by_example = {
    'default': ['magic_motion', 'wan_move', 'motion_canvas', 'pisco']
};

var stage2_methods_by_example = {
    'default': ['hunyuan', 'vace', 'gencompositor', 'our']
};

function selectStage2Example(example) {
    selected_stage2_example = example;
    updateStage2Example();
    showSelected();
}

function getStage2MethodFilename(method, example) {
    if (method === 'our') {
        return 'our.mp4';
    }
    if (method === 'gencompositor') {
        // example2 uses a shorter filename in current assets.
        if (example === 'example2') {
            return 'gencompose.mp4';
        }
        return 'gencompositor.mp4';
    }
    return method + '.mp4';
}

function updateStage2Example() {
    // Update prompt text
    var promptDiv = document.getElementById('stage2-prompt');
    if (promptDiv) {
        promptDiv.textContent = stage2_prompts[selected_stage2_example] || '';
    }
    
    // Update input video
    var inputVideo = document.getElementById('stage2-input-player');
    var inputSrc = document.getElementById('stage2-input-src');
    
    if (inputVideo && inputSrc) {
        inputVideo.pause();
        inputSrc.setAttribute('src', 'resources/stage2/' + selected_stage2_example + '/input.mp4');
        inputVideo.load();
        inputVideo.currentTime = 0;
        inputVideo.play();
    }
    
    // Update masked video
    var maskedVideo = document.getElementById('stage2-masked-player');
    var maskedSrc = document.getElementById('stage2-masked-src');
    
    if (maskedVideo && maskedSrc) {
        maskedVideo.pause();
        maskedSrc.setAttribute('src', 'resources/stage2/' + selected_stage2_example + '/masked.mp4');
        maskedVideo.load();
        maskedVideo.currentTime = 0;
        maskedVideo.play();
    }
    
    // Update I2V row videos
    var i2vMethodSlots = stage2_i2v_methods_by_example[selected_stage2_example] || stage2_i2v_methods_by_example.default;
    for (var i = 0; i < 4; i++) {
        var i2vMethod = i2vMethodSlots[i] || stage2_i2v_methods_by_example.default[i];
        var i2vVideo = document.getElementById('stage2-i2v-player-' + (i + 1));
        var i2vSrc = document.getElementById('stage2-i2v-src-' + (i + 1));
        var i2vLabel = document.getElementById('stage2-i2v-method-label-' + (i + 1));

        if (i2vLabel) {
            i2vLabel.textContent = stage2_method_label_map[i2vMethod] || i2vMethod;
        }

        if (i2vVideo && i2vSrc) {
            i2vVideo.pause();
            i2vSrc.setAttribute('src', 'resources/stage2/' + selected_stage2_example + '/' + getStage2MethodFilename(i2vMethod, selected_stage2_example));
            i2vVideo.load();
            i2vVideo.currentTime = 0;
            i2vVideo.play();
        }
    }

    // Update second row videos
    var methodSlots = stage2_methods_by_example[selected_stage2_example] || stage2_methods_by_example.default;
    var slotIds = ['hunyuan', 'vace', 'compositor', 'ours'];
    for (var j = 0; j < slotIds.length; j++) {
        var slotId = slotIds[j];
        var configuredMethod = methodSlots[j] || stage2_methods_by_example.default[j];
        var video = document.getElementById('stage2-' + slotId + '-player');
        var src = document.getElementById('stage2-' + slotId + '-src');
        var label = document.getElementById('stage2-method-label-' + (j + 1));

        if (label) {
            label.textContent = stage2_method_label_map[configuredMethod] || configuredMethod;
        }

        if (video && src) {
            video.pause();
            src.setAttribute('src', 'resources/stage2/' + selected_stage2_example + '/' + getStage2MethodFilename(configuredMethod, selected_stage2_example));
            video.load();
            video.currentTime = 0;
            video.play();
        }
    }
}

function updateStage1Example() {
    // Update prompt text
    var promptDiv = document.getElementById('stage1-prompt');
    if (promptDiv && stage1_prompts[selected_stage1_example]) {
        promptDiv.textContent = stage1_prompts[selected_stage1_example];
    }
    
    // Update input video
    var inputVideo = document.getElementById('stage1-input-player');
    var inputSrc = document.getElementById('stage1-input-src');
    
    if (inputVideo && inputSrc) {
        inputVideo.pause();
        inputSrc.setAttribute('src', 'resources/stage1/' + selected_stage1_example + '/input.mp4');
        inputVideo.load();
        inputVideo.currentTime = 0;
        inputVideo.play();
    }
    
    // Update motion path image
    var motionPath = document.getElementById('stage1-motion-path');
    if (motionPath) {
        motionPath.src = 'resources/stage1/' + selected_stage1_example + '/first.jpg';
    }
    
    // Update comparison videos
    var methods = ['inter', 'mega', 'depth', 'ours'];
    for (var i = 0; i < methods.length; i++) {
        var method = methods[i];
        var video = document.getElementById('stage1-' + method + '-player');
        var src = document.getElementById('stage1-' + method + '-src');
        
        if (video && src) {
            video.pause();
            var filename = method + '.mp4';
            if (method === 'ours') {
                filename = 'our.mp4';
            }
            src.setAttribute('src', 'resources/stage1/' + selected_stage1_example + '/' + filename);
            video.load();
            video.currentTime = 0;
            video.play();
        }
    }
}

function updateBaselineExample() {
    // Update prompt text
    var promptDiv = document.getElementById('baseline-prompt');
    if (promptDiv && baseline_prompts[selected_baseline_example]) {
        promptDiv.textContent = baseline_prompts[selected_baseline_example];
    }
    
    // Update input video
    var inputVideo = document.getElementById('baseline-input-player');
    var inputSrc = document.getElementById('baseline-input-src');
    
    if (inputVideo && inputSrc) {
        inputVideo.pause();
        inputSrc.setAttribute('src', 'resources/baselines/' + selected_baseline_example + '/input.mp4');
        inputVideo.load();
        inputVideo.currentTime = 0;
        inputVideo.play();
    }
    
    // Update motion path image
    var motionPath = document.getElementById('baseline-motion-path');
    if (motionPath) {
        motionPath.src = 'resources/baselines/' + selected_baseline_example + '/first.jpg';
    }
    
    // Update I2V row videos (first comparison row)
    var i2vMethodSlots = baseline_i2v_methods_by_example[selected_baseline_example] || baseline_i2v_methods_by_example.default;
    for (var i = 0; i < 4; i++) {
        var i2vMethod = i2vMethodSlots[i] || baseline_i2v_methods_by_example.default[i];
        var i2vVideo = document.getElementById('baseline-i2v-player-' + (i + 1));
        var i2vSrc = document.getElementById('baseline-i2v-src-' + (i + 1));
        var i2vLabel = document.getElementById('baseline-i2v-method-label-' + (i + 1));

        if (i2vLabel) {
            i2vLabel.textContent = baseline_method_label_map[i2vMethod] || i2vMethod;
        }

        if (i2vVideo && i2vSrc) {
            i2vVideo.pause();
            i2vSrc.setAttribute('src', 'resources/baselines/' + selected_baseline_example + '/' + i2vMethod + '.mp4');
            i2vVideo.load();
            i2vVideo.currentTime = 0;
            i2vVideo.play();
        }
    }

    // Update second row videos
    var methodSlots = baseline_methods_by_example[selected_baseline_example] || baseline_methods_by_example.default;
    var slotIds = ['hunyuan', 'vace', 'compositor', 'ours'];
    for (var j = 0; j < slotIds.length; j++) {
        var slotId = slotIds[j];
        var configuredMethod = methodSlots[j] || slotId;
        var video = document.getElementById('baseline-' + slotId + '-player');
        var src = document.getElementById('baseline-' + slotId + '-src');
        var label = document.getElementById('baseline-method-label-' + (j + 1));

        if (label) {
            label.textContent = baseline_method_label_map[configuredMethod] || configuredMethod;
        }

        if (video && src) {
            video.pause();
            src.setAttribute('src', 'resources/baselines/' + selected_baseline_example + '/' + configuredMethod + '.mp4');
            video.load();
            video.currentTime = 0;
            video.play();
        }
    }
}





function updateQualExample() {
    // Update prompt text
    var promptDiv = document.getElementById('qual-prompt');
    if (promptDiv && qual_prompts[selected_qual_example]) {
        promptDiv.textContent = qual_prompts[selected_qual_example];
    }
    
    // Update input video
    var inputVideo = document.getElementById('qual-input-player');
    var inputSrc = document.getElementById('qual-input-src');
    
    if (inputVideo && inputSrc) {
        inputVideo.pause();
        inputSrc.setAttribute('src', 'resources/qual_our_result/' + selected_qual_example + '/input.mp4');
        inputVideo.load();
        inputVideo.currentTime = 0;
        inputVideo.play();
    }
    
    // Update bounding box images
    var box1 = document.getElementById('qual-box1');
    var box2 = document.getElementById('qual-box2');
    var box3 = document.getElementById('qual-box3');
    
    if (box1) box1.src = 'resources/qual_our_result/' + selected_qual_example + '/box1.jpg';
    if (box2) box2.src = 'resources/qual_our_result/' + selected_qual_example + '/box2.jpg';
    if (box3) box3.src = 'resources/qual_our_result/' + selected_qual_example + '/box3.jpg';
    
    // Update output videos
    for (var i = 1; i <= 3; i++) {
        var outVideo = document.getElementById('qual-out-player' + i);
        var outSrc = document.getElementById('qual-out-src' + i);
        
        if (outVideo && outSrc) {
            outVideo.pause();
            outSrc.setAttribute('src', 'resources/qual_our_result/' + selected_qual_example + '/out' + i + '.mp4');
            outVideo.load();
            outVideo.currentTime = 0;
            outVideo.play();
        }
    }
}

function loadVideo(is_end) {
    var video1 = document.getElementById('video-player1');
    var video2 = document.getElementById('video-player2');
    var video_src1 = document.getElementById('video-src1');
    var video_src2 = document.getElementById('video-src2');

    var width = document.getElementById('container').clientWidth;
    var height = width / 768 * 432;
    video1.style.width = '' + width + 'px';
    video2.style.width = '' + width + 'px';
    video1.style.height = '' + height + 'px';
    video2.style.height = '' + height + 'px';
    
    video1.pause();
    video2.pause();
    if(prev_video1_path != video1_path) {
        video_src1.setAttribute('src', video1_path);
        video1.load();
    }
    if(prev_video2_path != video2_path) {
        video_src2.setAttribute('src', video2_path);
        video2.load();
    }
    prev_video1_path = video1_path;
    prev_video2_path = video2_path;
    
    video1.currentTime = 0;
    video2.currentTime = 0;
    
    video1.playbackRate = 1.6;
    video2.playbackRate = 1.6;
    
    video1.play();
    video2.play();        
}


function set_inactive(btn) {
    btn.classList.remove('is-info');
}
function set_active(btn) {
    btn.classList.add('is-info');
}

function showSelected() {
    var selected_index;

    // section 1: qual examples
    var sample_video_btns = document.getElementsByClassName('btn-sample-video');
    for(var i = 0; i < sample_video_btns.length; i++) {
        set_inactive(sample_video_btns[i]);
    }
    
    // Update for qual examples
    if (typeof selected_qual_example !== 'undefined' && selected_qual_example) {
        selected_index = ['example1', 'example2', 'example3', 'example4'].indexOf(selected_qual_example);
        if (selected_index >= 0) {
            set_active(sample_video_btns[selected_index]);
        }
    }
    
    // section 2: baseline examples
    var baseline_video_btns = document.getElementsByClassName('btn-baseline-video');
    for(var i = 0; i < baseline_video_btns.length; i++) {
        set_inactive(baseline_video_btns[i]);
    }
    
    // Update for baseline examples
    if (typeof selected_baseline_example !== 'undefined' && selected_baseline_example) {
        selected_index = ['example1', 'example2', 'example3', 'example4', 'example5', 'example6', 'example7'].indexOf(selected_baseline_example);
        if (selected_index >= 0) {
            set_active(baseline_video_btns[selected_index]);
        }
    }
    
    // section 3: stage1 examples
    var stage1_video_btns = document.getElementsByClassName('btn-stage1-video');
    for(var i = 0; i < stage1_video_btns.length; i++) {
        set_inactive(stage1_video_btns[i]);
    }
    
    // Update for stage1 examples
    if (typeof selected_stage1_example !== 'undefined' && selected_stage1_example) {
        selected_index = ['example1', 'example2', 'example3', 'example4'].indexOf(selected_stage1_example);
        if (selected_index >= 0) {
            set_active(stage1_video_btns[selected_index]);
        }
    }
    
    // section 4: stage2 examples
    var stage2_video_btns = document.getElementsByClassName('btn-stage2-video');
    for(var i = 0; i < stage2_video_btns.length; i++) {
        set_inactive(stage2_video_btns[i]);
    }
    
    // Update for stage2 examples
    if (typeof selected_stage2_example !== 'undefined' && selected_stage2_example) {
        selected_index = ['example1', 'example2', 'example3', 'example4', 'example5', 'example6', 'example7', 'example8', 'example9', 'example10'].indexOf(selected_stage2_example);
        if (selected_index >= 0) {
            set_active(stage2_video_btns[selected_index]);
        }
    }

    // section 0.75: two objects examples
    var twoobj_video_btns = document.getElementsByClassName('btn-twoobj-video');
    for (var i3 = 0; i3 < twoobj_video_btns.length; i3++) {
        set_inactive(twoobj_video_btns[i3]);
    }

    if (typeof selected_twoobj_example !== 'undefined' && selected_twoobj_example) {
        selected_index = ['example1', 'example2', 'example3'].indexOf(selected_twoobj_example);
        if (selected_index >= 0) {
            set_active(twoobj_video_btns[selected_index]);
        }
    }

    // section 0.5: our-only examples
    var our_only_video_btns = document.getElementsByClassName('btn-our-only-video');
    for (var i2 = 0; i2 < our_only_video_btns.length; i2++) {
        set_inactive(our_only_video_btns[i2]);
    }

    if (typeof selected_our_only_example !== 'undefined' && selected_our_only_example) {
        selected_index = our_only_examples.indexOf(selected_our_only_example);
        if (selected_index >= 0 && selected_index < our_only_video_btns.length) {
            set_active(our_only_video_btns[selected_index]);
        }
    }
}

/* Section 2: Visual comparison with baseline methods and SOTA */

var selected_compare_video = 'three-people';
var selected_compare_method = 'input';
var comp1_path = '';
var comp2_path = '';

function selectComparisonVideo(video) {
    selected_compare_video = video;
    update_comparison_source();
    showSelected();
}

function selectComparedMethod(method) {
    selected_compare_method = method;
    update_comparison_source();
    showSelected();
}

function update_comparison_source() {
    comp1_path = 'videos/' + selected_compare_video + '/' + selected_compare_method + '.mp4';
    comp2_path = 'videos/' + selected_compare_video + '/ours.mp4';

    loadComparison(false);
    document.getElementById('comparison-caption').innerHTML = method_full_names[selected_compare_method];
}

var prev_comp1_path = 'none';
var prev_comp2_path = 'none';
function loadComparison() {
    var video1 = document.getElementById('comparison-player1');
    var video2 = document.getElementById('comparison-player2');
    var video_src1 = document.getElementById('comparison-src1');
    var video_src2 = document.getElementById('comparison-src2');
    
    video1.pause();
    video2.pause();
    if(prev_comp1_path != comp1_path) {
        video_src1.setAttribute('src', comp1_path);
        video1.load();
    }
    if(prev_comp2_path != comp2_path) {
        video_src2.setAttribute('src', comp2_path);
        video2.load();
    }
    prev_comp1_path = comp1_path;
    prev_comp2_path = comp2_path;

    video1.currentTime = 0;
    video2.currentTime = 0;

    video1.playbackRate = 1.6;
    video2.playbackRate = 1.6;
    video1.play();
    video2.play();
}

function update_comparison_source() {
    comp1_path = 'videos/' + selected_compare_video + '/' + selected_compare_method + '.mp4';
    comp2_path = 'videos/' + selected_compare_video + '/ours.mp4';

    loadComparison(false);
    document.getElementById('comparison-caption').innerHTML = method_full_names[selected_compare_method];
}

var selected_sample_video = 'sample-hard';
var sample_vid_path = '';
var sample_matte_path = '';

function selectSampleVideo(video) {
    selected_sample_video = video;
    update_sample_source();
    showSelected();
}

function update_sample_source() {
    sample_vid_path = 'videos/' + selected_sample_video + '/input.mp4';
    sample_matte_path = 'videos/' + selected_sample_video + '/matte.mp4';
    loadSample(false);
}

var prev_sample_vid_path = 'none';
var prev_sample_matte_path = 'none';
function loadSample() {
    var video1 = document.getElementById('sample-player1');
    var video2 = document.getElementById('sample-player2');
    var video_src1 = document.getElementById('sample-src1');
    var video_src2 = document.getElementById('sample-src2');
    
    video1.pause();
    video2.pause();
    if(prev_sample_vid_path != sample_vid_path) {
        video_src1.setAttribute('src', sample_vid_path);
        video1.load();
    }
    if(prev_sample_matte_path != sample_matte_path) {
        video_src2.setAttribute('src', sample_matte_path);
        video2.load();
    }
    prev_sample_vid_path = sample_vid_path;
    prev_sample_matte_path = sample_matte_path;

    video1.currentTime = 0;
    video2.currentTime = 0;

    video1.playbackRate = 1.6;
    video2.playbackRate = 1.6;
    video1.play();
    video2.play();
}

function loadTeaser() {
    var video = document.getElementById('teaser-player');
    video.play();
}