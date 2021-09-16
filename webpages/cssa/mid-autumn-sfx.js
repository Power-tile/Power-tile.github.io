Vue.createApp({
  data() {
    return {
      controlIndex: 0,
      audioIndex: -1,
      info: [
        {
          name: "enlarged-door-open-close.mp3",
          start: 0.8,
          volume: 0.8
        },
        {
          name: "alarm-final.mp3",
          start: 0,
          volume: 0.9
        },
        {
          name: 'western-coast-unedited.mp3',
          start: 8,
          volume: 0.2
        },
        {
          name: '伝えたい気持ち - 松谷卓.mp3',
          start: 0.5,
          volume: 0.4,
        },
        {
          name: '春节序曲 - 中国国家交响乐团.mp3',
          start: 0.5,
          volume: 0.3
        },
        {
          name: 'beep.mp3',
          start: 0,
          volume: 1
        },
        {
          name: "wechat-voice.mp3",
          start: 0,
          volume: 0.8
        },
        {
          name: "wechat-notify.mp3",
          start: 0,
          volume: 0.8
        }
      ],
      controls: [
        {
          name: "enter-dorm",
          func: () => { this.playAudio(0); }
        },
        {
          name: "start-siren",
          func: () => { this.playAudio(1, true); }
        },
        {
          name: "fade-siren",
          func: () => { this.lowerVolume(0.4, 1); }
        },
        {
          name: "mute-siren",
          func: () => { this.fadeStop(4); }
        },
        {
          name: "wechat-notification",
          func: () => { this.playAudio(7); }
        },
        {
          name: "wechat-voice",
          func: () => { this.playAudio(6); }
        },
        {
          name: "western-coast",
          func: () => { this.playAudio(2); }
        },
        {
          name: "answer-call",
          func: () => { this.directStop(); this.playAudio(5); }
        },
        {
          name: "emo",
          func: () => { this.playAudio(3); }
        },
        {
          name: "emo-fade",
          func: () => {this.fadeStop(2); }
        },
        {
          name: "celebrate",
          func: () => { this.directStop(); this.playAudio(4); }
        },
        {
          name: "ending",
          func: () => { this.fadeStop(10); }
        }
      ],
      audioPlay: {},
    }
  },
  methods: {
    nextEvent() {
      console.log("next presssed");
      this.controls[this.controlIndex].func();
      this.controlIndex++;
    },
    playAudio(index, loop = false) {
      this.audioIndex = index;
      this.audioPlay = new Howl({
        src: ['../../asset/audio/cssa-mid-autumn/' + this.info[index].name],
        loop,
      });
      this.audioPlay.volume(this.info[index].volume);
      this.audioPlay.seek(this.info[index].start);
      this.audioPlay.play();
    },
    lowerVolume(newVolume, time) {
      this.audioPlay.fade(this.audioPlay.volume(), newVolume, time*1000);
    },
    fadeStop(time) {
      this.audioPlay.fade(this.audioPlay.volume(), 0, time * 1000);
      this.audioPlay.onfade = () => {
        this.audioPlay.stop();
      }
    },
    directStop() {
      if (this.audioPlay.stop !== undefined)
        this.audioPlay.stop();
    }
  }
}).mount("#app");