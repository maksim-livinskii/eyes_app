class AppController {
  constructor($scope, $http) {

    this.$scope = $scope;
    this.$http = $http;

    this.defaultState = {
      image: null,
      images: [],
      eyes: [],
      count: 0
    };

    this.chart = {};

    this.location = 'home';
    this.results = [];

    this.state = angular.copy(this.defaultState);
  }

  goTo(location) {
    this.location = location;
  }

  is(location) {
    return this.location === location;
  }

  isData() {
    return this.state.image || this.state.eyes.length > 0;
  }

  isDataComplete() {
    return this.state.eyes && this.results && this.state.eyes.length === this.results.length;
  }

  takePhoto() {
    if (this.state.eyes.length) {
      navigator.notification.confirm(
        'All current data will be removed!', // message
         this._takePhoto,            // callback to invoke with index of button pressed
        'Do you really want to load new photos ?',           // title
        ['No', 'Yes']     // buttonLabels
      );
    } else {
      this._takePhoto();
    }
  }

  _takePhoto = (index) => {
    if (this.state.eyes.length && (!index || index === 1)) return; // if No

    this.state = angular.copy(this.defaultState);

    window.imagePicker.getPictures(
    	(results) => {
        this.results = results;
        this.state.takedPhoto = results.length > 0;
    		this.process(results);
        this.location = 'home';
        this.$scope.$apply();
    	}, (error) => {
    		console.log('Error: ' + error); // log
    	}, {
    		maximumImagesCount: 100
    	}
    );
  }

  process(images) {
    this.state.allImagesCount = images.length;

    this.firstImageDate = null;
    this.lastImageDate = null;

    Promise.all(images.map(image => this.getFile(image)))
      .then((files) => {
        files.forEach(({ file }) => {

          this.firstImageDate = this.firstImageDate || file.lastModifiedDate;
          this.lastImageDate = this.lastImageDate || file.lastModifiedDate;

          if (this.firstImageDate > file.lastModifiedDate) {
            this.firstImageDate = file.lastModifiedDate;
          }

          if (this.lastImageDate < file.lastModifiedDate) {
            this.lastImageDate = file.lastModifiedDate;
          }
        })

        this.state.step = (this.lastImageDate - this.firstImageDate) / images.length;

        return files;
      })
      .then((files) => {
        let show = true;
        files.forEach(({ file }) => {
          this.getFileContentAsBase64(file)
            .then((image) => {

              const request = {
                method: 'POST',
                data: { image, show },
                // url: 'http://192.168.0.102:3000/process' // TODO: move IP address into config
                url: 'https://damp-plateau-52071.herokuapp.com/process' // TODO: move IP address into config
              };

              this.$http(request)
                .then((res) => {

                  if (res.data.image) {
                    this.state.image = res.data.image;
                  }

                  // this.state.images.push(res.data.image);

                  this.state.eyes.push({
                    left: res.data.left,
                    right: res.data.right
                  });

                  this.state.count += 1;
                });

              show = false;
            });
        });
      });
  }

  getFile(path) {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(path, (fileEntry) => {

        // console.log('fileEntry.toURL: ', fileEntry.toURL());
        // let url = fileEntry.toURL();
        // let arr = url.match(/(.*\D)(\d+)(.*)/);
        // for (let i = Number(arr[2]); i < Number(arr[2]) + 100; i++) {
        //   let num = i;
        //   if (num < 100 && arr[2][0] === '0') {
        //     num = `0${num}`;
        //   }
        //   if (num < 10 && arr[2][1] === '0') {
        //     num = `0${num}`;
        //   }
        //
        //   var reader = new FileReader();
        //   reader.readAsDataURL(`${arr[1]}${num}${arr[3]}`);
        //   reader.onload =  function(e){
        //       console.log('DataURL:', e.target.result);
        //   };
        // }

        fileEntry.file(function(file) {
          resolve({ file });
        });
      }, (err) => {
        reject(err);
      });
    });
  }

  getFileContentAsBase64(file) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = function(e) {
        const body = this.result;
        resolve({ body });
        reader.onload = null;
        reader = null;
      };
      reader.readAsDataURL(file);
    });
  }

  draw() {
    const leftEye = this.state.eyes.map(eye => eye.left)
    const rightEye = this.state.eyes.map(eye => eye.right)

    const step = this.state.step / 1000;
    let time = 0;

    let leftX = leftEye.map((eye) => {
      const res = { x: Math.round(time * 100) / 100, y: eye.x };
      time += step;
      return res;
    });

    time = 0;

    let rightX = rightEye.map((eye) => {
      const res = { x: Math.round(time * 100) / 100, y: eye.x };
      time += step;
      return res;
    });

    time = 0;

    let leftY = leftEye.map((eye) => {
      const res = { x: Math.round(time * 100) / 100, y: eye.y };
      time += step;
      return res;
    });

    time = 0;

    let rightY = rightEye.map((eye) => {
      const res = { x: Math.round(time * 100) / 100, y: eye.y };
      time += step;
      return res;
    });

    let maxX = 0;
    let maxY = 0;

    let minX = leftX[0].y < rightX[0].y ? leftX[0].y : rightX[0].y;
    let minY = leftY[0].y < rightY[0].y ? leftY[0].y : rightY[0].y;

    for (let i = 0; i < leftX.length; i++) {
      if (maxX < leftX[i].y) {
        maxX = leftX[i].y;
      }
      if (maxX < rightX[i].y) {
        maxX = rightX[i].y;
      }
      if (minX > leftX[i].y) {
        minX = leftX[i].y;
      }
      if (minX > rightX[i].y) {
        minX = rightX[i].y;
      }
    }

    for (let i = 0; i < leftY.length; i++) {
      if (maxY < leftY[i].y) {
        maxY = leftY[i].y;
      }
      if (maxY < rightY[i].y) {
        maxY = rightY[i].y;
      }
      if (minY > leftY[i].y) {
        minY = leftY[i].y;
      }
      if (minY > rightY[i].y) {
        minY = rightY[i].y;
      }
    }

    this.chart.data1 = [
      {
        values: leftX,
        color: '#2e6da4',
        key: 'Left',
      },
      {
        values: rightX,
        color: '#00cc66',
        key: 'Right',
      }
    ];

    this.chart.data2 = [
      {
        values: leftY,
        color: '#2e6da4',
        key: 'Left',
      },
      {
        values: rightY,
        color: '#00cc66',
        key: 'Right',
      }
    ];

    this.chart.options1 = this.getOptions({
      text: "Left and Right eyes. X coordinate",
      axisLabel: "X",
      min: minX,
      max: maxX
    });

    this.chart.options2 = this.getOptions({
      text: "Left and Right eyes. Y coordinate",
      axisLabel: "Y",
      min: minY,
      max: maxY
    });

  }

  getOptions({ axisLabel, text, min, max }) {
    return {
      chart: {
        "type": "lineChart",
        "height": 225,
        "margin": {
          "top": 5,
          "right": 20,
          "bottom": 40,
          "left": 40
        },
        xAxis: {
          axisLabel: "t, sec",
          ticks: 3,
          showMaxMin: true,
        },
        yAxis: {
          axisLabel,
          "axisLabelDistance": -20,
          showMaxMin: true,
          ticks: 4,
        },
        yDomain: [min - 50, max + 50],
      },
      "title": {
        enable: true,
        text
      },
      stacked: false,
      showControls: false,
    };
  }

}

export { AppController };
