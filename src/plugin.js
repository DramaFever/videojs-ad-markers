import videojs from 'video.js';
import {version as VERSION} from '../package.json';

const Plugin = videojs.getPlugin('plugin');

// Default options for the plugin.
const defaults = {};

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */
class AdMarkers extends Plugin {

  /**
   * Create a AdMarkers plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         While not a core part of the Video.js plugin architecture, a
   *         second argument of options is a convenient way to accept inputs
   *         from your plugin's caller.
   */
  constructor(player, options) {
    // the parent class will add player under this.player
    super(player);

    this.options = videojs.mergeOptions(defaults, options);

    this.markersMap = {};
    this.markersList = [];
    this.isInitialized = false;

    this.player.ready(() => {
      this.player.addClass('vjs-ad-markers');
    });

    this.player.on('adsready', () => {
      this.initialize();
    });
  }

  generateUUID() {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (d + Math.random() * 16) % 16 | 0;

      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    return uuid;
  }

  stylizeMarker(jMarkerDiv, position) {
    jMarkerDiv.style.left = position + '%';
  }

  getMarkerTime(marker) {
    return marker.time;
  }

  sortMarkersList() {
    // sort the list by time in asc order
    this.markersList.sort((a, b) => {
      return this.getMarkerTime(a) - this.getMarkerTime(b);
    });
  }

  addMarkers(newMarkers) {

    // create the adMarkers
    newMarkers.forEach((marker, index) => {
      marker.key = this.generateUUID();

      this.player.$('.vjs-progress-control').appendChild(this.createMarkerDiv(marker));

      // store marker in an internal hash map
      this.markersMap[marker.key] = marker;
      this.markersList.push(marker);
    });

    this.sortMarkersList();
  }

  getPosition(marker) {
    return (this.getMarkerTime(marker) / this.player.duration()) * 100;
  }

  createMarkerDiv(marker) {
    /* eslint-disable no-undef */
    const markerDiv = document.createElement('div');

    markerDiv.className += 'vjs-admarker';
    if (marker.loader !== false) {
      markerDiv.className += ' vjs-admarker-announcer';
    }

    // stylize (and position) the marker
    this.stylizeMarker(markerDiv, this.getPosition(marker));

    markerDiv.dataset.markerKey = marker.key;
    markerDiv.dataset.markerTime = this.getMarkerTime(marker);

    return markerDiv;
  }

  removeAll() {
    const indexArray = [];

    for (let i = 0; i < this.markersList.length; i++) {
      indexArray.push(i);
    }
    this.removeMarkers(indexArray);
  }

  removeMarkers(indexArray) {

    for (let i = 0; i < indexArray.length; i++) {
      const index = indexArray[i];
      const marker = this.markersList[index];

      if (marker) {
        // delete from memory
        delete this.markersMap[marker.key];
        this.markersList[index] = null;

        // delete from dom
        this.player.$(".vjs-admarker[data-marker-key='" + marker.key + "']").remove();
      }
    }

    // clean up array
    for (let i = this.markersList.length - 1; i >= 0; i--) {
      if (this.markersList[i] === null) {
        this.markersList.splice(i, 1);
      }
    }

    // sort again
    this.sortMarkersList();
  }

  initialize() {
    if (this.isInitialized === false) {
      this.isInitialized = true;
      // remove existing adMarkers if already initialized
      this.removeAll();
      this.addMarkers(this.options.markers);
    }
  }

}

// Define default values for the plugin's `state` object here.
AdMarkers.defaultState = {};

// Include the version number.
AdMarkers.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('adMarkers', AdMarkers);

export default AdMarkers;
