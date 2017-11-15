import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import { connect } from 'react-redux';

import { extendAppStyleSheet } from './style-sheet';

const styles = extendAppStyleSheet({
  titleContainer: {
    backgroundColor: '#FFCCCD',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  title: {
    color: '#000',
    fontSize: 20,
  },
  attending: {
    padding: 10,
    textDecorationLine: 'underline',
  },
  map: {
    flex: 1,
    height: 200,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionContainer: {
    margin: 10,
  },
  buttonContainer: {
    flex: 1,
    marginBottom: 10,
  },
});

class RealTimeEvent extends Component {
  static navigationOptions = {
    title: 'Real-time Event',
  };

  constructor(props) {
    super(props);

    this.state = {
      title: 'Very Urgent Super Emergency',
      address: '93-99 Burelli St, Wollongong NSW 2500',
      attending: false,
      checkedIn: false,
      respondees: [
        {
          attending: 'site',
          checkedIn: true,
        },
        {
          attending: 'site',
          checkedIn: false,
        },
        {
          attending: 'hq',
          checkedIn: false,
        },
      ],
    };

    this.onAttendingSite = this.onAttendingSite.bind(this);
    this.onAttendingHQ = this.onAttendingHQ.bind(this);
    this.onUnavailable = this.onUnavailable.bind(this);
    this.onArrived = this.onArrived.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onCheckOut = this.onCheckOut.bind(this);
  }

  onAttendingSite() {
    this.setState({ attending: 'site' });
  }

  onAttendingHQ() {
    this.setState({ attending: 'hq' });
  }

  onUnavailable() {
    this.setState({ attending: false });

    // TODO this should probably just navigate back.
    this.props.navigation.navigate('Events');
  }

  onArrived() {
    this.setState({ checkedIn: true });
  }

  onCancel() {
    this.setState({ attending: false });
  }

  onCheckOut() {
    this.setState({ checkedIn: false });
  }

  isEnRoute() {
    return this.state.attending && !this.state.checkedIn;
  }

  render() {
    const { checkedIn } = this.state;

    // Get the appropriate action buttons for the current state.
    let actions;

    if (checkedIn) {
      actions = <CheckedInActions checkOut={this.onCheckOut} />;
    } else if (this.isEnRoute()) {
      actions = (
        <EnRouteActions arrived={this.onArrived} cancel={this.onCancel} />
      );
    } else {
      actions = (
        <InitialActions
          attendingSite={this.onAttendingSite}
          attendingHQ={this.onAttendingHQ}
          unavailable={this.onUnavailable}
        />
      );
    }

    // Get the number of people en-route and there.
    const { respondees } = this.state;
    const checkedInCount = respondees.filter(r => r.checkedIn).length;
    const enRouteCount = respondees.length - checkedInCount;

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{this.state.title}</Text>
          <Text style={styles.address}>{this.state.address}</Text>
        </View>
        <Text style={styles.attending}>
          Attending: {checkedInCount} checked in, {enRouteCount} en-route&hellip;
        </Text>
        <MapView style={styles.map} />
        <View style={styles.actionContainer}>
          {actions}
        </View>
      </View>
    );
  }
}

RealTimeEvent.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

const InitialActions = ({ attendingSite, attendingHQ, unavailable }) => (
  <View>
    <Text>I will attend&hellip;</Text>
    <View style={styles.buttonRow}>
      <View style={styles.buttonContainer}>
        <Button title="HQ" onPress={attendingSite} color="#44A020" />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Site" onPress={attendingHQ} color="#44A020" />
      </View>
    </View>
    <Button title="I'm unavailable" onPress={unavailable} color="#930000" />
  </View>);

InitialActions.propTypes = {
  attendingSite: PropTypes.func,
  attendingHQ: PropTypes.func,
  unavailable: PropTypes.func,
};

const EnRouteActions = ({ arrived, updateEta, cancel }) => (
  <View>
    <View style={styles.buttonRow}>
      <View style={styles.buttonContainer}>
        <Button title="Update my ETA" onPress={updateEta} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="I&apos;ve arrived" onPress={arrived} color="#44A020" />
      </View>
    </View>
    <Button title="Cancel attendance" onPress={cancel} color="#930000" />
  </View>
);

EnRouteActions.propTypes = {
  arrived: PropTypes.func,
  updateEta: PropTypes.func,
  cancel: PropTypes.func,
};

const CheckedInActions = ({ checkOut }) => (
  <View>
    <Button title="I've left" onPress={checkOut} color="#930000" />
  </View>
);

CheckedInActions.propTypes = {
  checkOut: PropTypes.func,
};

export default connect()(RealTimeEvent);
