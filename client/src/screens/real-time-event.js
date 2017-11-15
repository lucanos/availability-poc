import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';
import { connect } from 'react-redux';

class RealTimeEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      attending: false,
      checkedIn: false,
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

    return (
      <View>
        {actions}
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
    <View>
      <Button title="Site" onPress={attendingSite} />
      <Button title="HQ" onPress={attendingHQ} />
    </View>
    <Button title="I'm unavailable" onPress={unavailable} />
  </View>
);

InitialActions.propTypes = {
  attendingSite: PropTypes.func,
  attendingHQ: PropTypes.func,
  unavailable: PropTypes.func,
};

const EnRouteActions = ({ arrived, updateEta, cancel }) => (
  <View>
    <View>
      <Button title="Update my ETA" onPress={updateEta} />
      <Button title="I&apos;ve arrived" onPress={arrived} />
    </View>
    <Button title="Cancel attendance" onPress={cancel} />
  </View>
);

EnRouteActions.propTypes = {
  arrived: PropTypes.func,
  updateEta: PropTypes.func,
  cancel: PropTypes.func,
};

const CheckedInActions = ({ checkOut }) => (
  <View>
    <Button title="I've left" onPress={checkOut} />
  </View>
);

CheckedInActions.propTypes = {
  checkOut: PropTypes.func,
};

export default connect()(RealTimeEvent);
