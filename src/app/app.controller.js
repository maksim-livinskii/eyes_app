class AppController {
  constructor($scope, $http) {

    this.$scope = $scope;
    this.$http = $http;

    this.defaultState = {
      images: [],
      eyes: [],
      count: 0
    };

    this.location = 'home';

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

  takePhoto() {
    this.state = angular.copy(this.defaultState);

    window.imagePicker.getPictures(
    	(results) => {
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

    images.forEach((image, index) => {
      this.getFileContentAsBase64(image)
        .then((image) => {

          console.log('done', image);
          this.count += 1;

          this.$scope.$apply();

          const isLast = images.length - 1 == index;

          const request = {
            method: 'POST',
            data: { image, isLast },
            // url: 'http://192.168.0.102:3000/process' // TODO: move IP address into config
            url: 'https://damp-plateau-52071.herokuapp.com/process' // TODO: move IP address into config
          };

          image = null;

          this.$http(request)
            .then((res) => {
              console.log(res);
              // this.images.push(res.data.image),
              // if (res.data.image) {
              //   this.state.image = res.data.image;
              // }

              this.state.images.push(res.data.image);

              this.state.eyes.push({
                left: res.data.left,
                right: res.data.right
              });

              this.state.count += 1;
            });
        });
    });
  }

  getFileContentAsBase64(path) {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(path, (fileEntry) => {
        fileEntry.file(function(file) {
          var reader = new FileReader();
          reader.onload = function(e) {
            const body = this.result;
            resolve({ body });
            reader.onload = null;
            reader = null;
            file = null;
            fileEntry = null;
          };
          reader.readAsDataURL(file);
        });
      }, (err) => {
        reject(err);
      });
    });
  }
}

export { AppController };
