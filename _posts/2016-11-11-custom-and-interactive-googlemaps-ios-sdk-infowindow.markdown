---
layout:     post
title:      Custom and interactive googlemaps(IOS SDK) infowindow
date:       2016-11-11 15:30:19
summary:    Replace default static UIImage with your interactive UIView
categories: swift
---


Recently I am working on an IOS app called _<span class="red">SFU Commute</span>_, it contains a map view that will display a bunch of location markers, we want to customize the marker as well as the infowindow, becuase obviously <del>google map looks bad</del> we want the components to fit in the app style.

#### Our prototype looks like this:

<img src="/images/prototype1.jpg" height="500"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="/images/prototype2.jpg" height="500"/>

Then, I looked at [documentation](https://developers.google.com/maps/documentation/ios-sdk/reference/protocol_g_m_s_map_view_delegate-p.html#ab83c3dab588f06e6227794740782bf55) of GMSMapView delegate about custom infowindow. It states that:

{% highlight swift %}
func mapView(_ mapView: GMSMapView, markerInfoWindow marker: GMSMarker) -> UIView? {
  // Called when a marker is about to become selected,
  // and provides an optional custom info window to use
  // that marker if this method returns a UIView.
}
{% endhighlight %}

### Oh, nice! Let's just use this delegate method to create the UIView of the infowindow.
_(Heads up: Don't try, it won't work!)_

So I added the delegate:
{% highlight swift %}
class MapView: UIViewController, GMSMapViewDelegate {
{% endhighlight %}
And return a custom class _mapMarkerInfoWindow(a subclass of UIView)_ like this:
{% highlight swift %}
func mapView(_ mapView: GMSMapView, markerInfoWindow marker: GMSMarker) -> UIView? {
  var infoWindow = mapMarkerInfoWindow(frame: CGRect(x: 0, y: 0, width: 200, height: 100))

  //set up information to be shown
  infoWindow.Name.text = (marker.userData as! location).name
  infoWindow.Price.text = (marker.userData as! location).price.description
  infoWindow.Zone.text = (marker.userData as! location).zone.rawValue
  infoWindow.button.addTarget(self, action: #selector(buttonTapped(_:)), for: .touchUpInside)
  return infoWindow
}

func buttonTapped(_ sender: UIButton!) {
  print("Yeah! Button is tapped!")
}
{% endhighlight %}

Then the custom infowindow successfully showed up when I tap on the markers.
But, when I tap on the buttons inside of the infowindow, __nothing happens!__ Soon, I found out that googlemap renders infowindow as a UIImage, all interactions are discarded before the view gets loaded onto the screen. After that, I searched on google and stackoverflow, but I can only find people who ask this problem not a real solution for it. :(

(Googlemap delegate provides a tap function to detect tap gesture on infowindow, but the function cannot make the buttons interactive as the whole infowindow is an image, so we need to work around that!)

## My Solution

I want to have buttons in the infowindow as it is very important for the workflow of the application, so I decided to find a way to work around it instead of change the design of the app! _(Isn't this what software engineering is all about?)_

Because there is no way to make the googlemap's infowindow to be interactive, I decided to go another route, make my own infowindow. You might be scared that will that be a lot of work? The answer is no.

My solution is basically disable the googlemaps' infowindow by set it to <del>nil</del> empty UIView object. Create a custom infowindow that is a part of the mapview. It follows the logic:
* Whenever a marker is tapped, use _GMSProjection_ object to map the location coordinates to a point on screen, render the custom infowindow on the point on screen. So it looks like a corresponding infowindow is poped up.
* Whenever the camera view is changed (i.e. user drags or zooms in the map), get the new point of the marker and move the infowindow to where the marker is at. So the infowindow will always be on top of the marker.
* Take care of the open/close actions of the custom infowindow.
* Remeber to keep the marker and infowindow object.

{% highlight swift %}
// initialize and keep a marker and a custom infowindow
    var tappedMarker = GMSMarker()
    var infoWindow = mapMarkerInfoWindow(frame: CGRect(x: 0, y: 0, width: 200, height: 100))

    //empty the default infowindow
    func mapView(_ mapView: GMSMapView, markerInfoWindow marker: GMSMarker) -> UIView? {
        return UIView()
    }

    // reset custom infowindow whenever marker is tapped
    func mapView(_ mapView: GMSMapView, didTap marker: GMSMarker) -> Bool {
        let location = CLLocationCoordinate2D(latitude: (marker.userData as! location).lat, longitude: (marker.userData as! location).lon)

        tappedMarker = marker
        infoWindow.removeFromSuperview()
        infoWindow = mapMarkerInfoWindow(frame: CGRect(x: 0, y: 0, width: 200, height: 100))
        infoWindow.Name.text = (marker.userData as! location).name
        infoWindow.Price.text = (marker.userData as! location).price.description
        infoWindow.Zone.text = (marker.userData as! location).zone.rawValue
        infoWindow.center = mapView.projection.point(for: location)
        infoWindow.button.addTarget(self, action: #selector(buttonTapped(_:)), for: .touchUpInside)
        self.view.addSubview(infoWindow)

        // Remember to return false
        // so marker event is still handled by delegate
        return false
    }

    // let the custom infowindow follows the camera
    func mapView(_ mapView: GMSMapView, didChange position: GMSCameraPosition) {
        if (tappedMarker.userData != nil){
            let location = CLLocationCoordinate2D(latitude: (tappedMarker.userData as! location).lat, longitude: (tappedMarker.userData as! location).lon)
            infoWindow.center = mapView.projection.point(for: location)
        }
    }

    // take care of the close event
    func mapView(_ mapView: GMSMapView, didTapAt coordinate: CLLocationCoordinate2D) {
        infoWindow.removeFromSuperview()
    }
{% endhighlight %}

Now, we have complete control over the custom infowindow, you can add buttons, labels, and whatever you want on the custom infowindow!

Downside of my solution is that if you have navigation bar on top of the screen, and possibly prompt in the navigation item, there exists an offset y value for the infowindow, so the infowindow is not right on top of the marker, we need to bypass this problem by manually correct the offset.

{% highlight swift %}
  // you need to determine this possible offset
  // for me it was 80
  infowindow.center.x += 80
{% endhighlight %}

#### Thanks! That's it for customizing IOS google map marker infowindow, I hope it could help someone solve the problem!
