var gameArray  = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7],
    pickedTiles = [],
    scoreText,
    moves = 0;

var gameScene = cc.Scene.extend({
    onEnter: function () {
        gameArray = shuffle(gameArray);
        this._super();

        gameLayer = new game();
        gameLayer.init();
        this.addChild(gameLayer);
    }
});

var game = cc.Layer.extend({
    init: function () {
        this._super();

        var gradient = cc.LayerGradient.create(cc.color(0,0,0,255), cc.color(0x46, 0x82, 0xB4, 255));
        this.addChild(gradient);

        scoreText = cc.LabelTTF.create('Moves: 0', 'Arial', '32', cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(scoreText);
        scoreText.setPosition(90, 50);

        for (var i = 0; i < 16; i++) {
            var tile = new MemoryTile();
            tile.pictureValue = gameArray[i];
            this.addChild(tile, 0);
            tile.setPosition(49 + i % 4 * 74, 400 - Math.floor(i/4) * 74);
        }
    }
});

var listener = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan: function (touch, event) {
        if (pickedTiles.length < 2) {
            var target = event.getCurrentTarget();
            var location = target.convertToNodeSpace(touch.getLocation());
            var targetSize = target.getContentSize();
            var targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
            if (cc.rectContainsPoint(targetRectangle, location)) {
                if (pickedTiles.indexOf(target) == -1) {
                    target.initWithFile('res/tile_' + target.pictureValue + '.png');
                    pickedTiles.push(target);
                    if (pickedTiles.length === 2) {
                        checkTiles();
                    }
                }
            }
        }
    }
});

var MemoryTile = cc.Sprite.extend({
    ctor: function () {
        this._super();
        this.initWithFile('res/cover.png');
        cc.eventManager.addListener(listener.clone(), this);
    }
});

function checkTiles() {
    moves++;
    scoreText.setString('Moves: ' + moves);
    var pause = setTimeout(function () {
        if (pickedTiles[0].pictureValue !== pickedTiles[1].pictureValue) {
            pickedTiles[0].initWithFile('res/cover.png');
            pickedTiles[1].initWithFile('res/cover.png');
        } else {
            gameLayer.removeChild(pickedTiles[0]);
            gameLayer.removeChild(pickedTiles[1]);
        }
        pickedTiles = [];
    }, 1000)
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}