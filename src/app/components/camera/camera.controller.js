class CameraController {
  constructor($http, $scope, Upload) {
    'ngInject';

    this.$http = $http;
    this.$scope = $scope;
    this.Upload = Upload;

    this.image = null;
    this.eyes = [];
    // this.images = [];

    this.count = 0;
  }

  takePhoto() {
    this.image = null;
    this.eyes = [];
    // this.images = [];
    this.count = 0;

    window.imagePicker.getPictures(
    	(results) => {
    		this.process(results);
    	}, (error) => {
    		console.log('Error: ' + error); // log
    	}, {
    		maximumImagesCount: 100
    	}
    );
  }

  process(images) {
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
              if (res.data.image) {
                this.image = res.data.image;
              }

              this.eyes.push({
                left: res.data.left,
                right: res.data.right
              });
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

export { CameraController };
