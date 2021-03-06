import React from 'react';
import { connect, useSelector } from 'react-redux';
import { TimePicker } from '@entur/datepicker';
import { ClockIcon } from '@entur/icons';
import StopPoint from 'model/StopPoint';
import PassingTime from 'model/PassingTime';
import { changeElementAtIndex } from 'helpers/arrays';
import { SmallAlertBox } from '@entur/alert';
import { validateTimes } from 'helpers/validation';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { IntlState } from 'react-intl-redux';
import { selectIntl } from 'i18n';
import PassingTimeTitle from './PassingTimeTitle';
import './styles.scss';
import { getErrorFeedback } from 'helpers/errorHandling';
import DayOffsetDropdown from 'components/DayOffsetDropdown';

const toDate = (date: string | undefined): Date | undefined => {
  if (!date) return;
  const [hours, minutes, seconds] = date.split(':');
  const dateObj = new Date();
  dateObj.setHours(parseInt(hours));
  dateObj.setMinutes(parseInt(minutes));
  dateObj.setSeconds(parseInt(seconds));

  return dateObj;
};

type StateProps = {
  flexibleStopPlaces: FlexibleStopPlace[];
  intl: IntlState;
};

type Props = {
  passingTimes: PassingTime[];
  stopPoints: StopPoint[];
  onChange: (pts: PassingTime[]) => void;
  spoilPristine: boolean;
};

const PassingTimesEditor = (props: Props & StateProps) => {
  const {
    stopPoints,
    passingTimes,
    intl,
    onChange,
    flexibleStopPlaces,
    spoilPristine,
  } = props;

  const { isValid, errorMessage } = validateTimes(passingTimes, intl);
  const { formatMessage } = useSelector(selectIntl);

  type DayOffsetKey = 'arrivalDayOffset' | 'departureDayOffset';

  const getDayOffsetDropdown = (
    passingTime: PassingTime,
    index: number,
    dayOffsetKey: DayOffsetKey,
    otherDayOffsetKey: DayOffsetKey,
    disabled: boolean,
    overrideOther: boolean
  ) => (
    <DayOffsetDropdown
      value={passingTime[dayOffsetKey] as number}
      disabled={disabled}
      onChange={(value) =>
        onChange(
          changeElementAtIndex(
            passingTimes,
            {
              ...passingTimes[index],
              [dayOffsetKey]: value,
              [otherDayOffsetKey]: overrideOther
                ? value
                : passingTimes[index][otherDayOffsetKey],
            },
            index
          )
        )
      }
    />
  );

  const getTimePicker = (
    passingTime: PassingTime,
    index: number,
    isLast: boolean
  ) => {
    return (
      <>
        <TimePicker
          disabled={index === 0}
          label={formatMessage('passingTimesArrivalTime')}
          className="timepicker"
          onChange={(e: Date | null) => {
            const date = e?.toTimeString().split(' ')[0];

            onChange(
              changeElementAtIndex(
                passingTimes,
                {
                  ...passingTimes[index],
                  arrivalTime: date,
                  departureTime: isLast
                    ? date
                    : passingTimes[index].departureTime,
                },
                index
              )
            );
          }}
          prepend={<ClockIcon inline />}
          selectedTime={toDate(passingTime.arrivalTime)}
        />
        {getDayOffsetDropdown(
          passingTime,
          index,
          'arrivalDayOffset',
          'departureDayOffset',
          index === 0,
          isLast
        )}
        <TimePicker
          disabled={isLast}
          label={formatMessage('passingTimesDepartureTime')}
          className="timepicker"
          onChange={(e: Date | null) => {
            const date = e?.toTimeString().split(' ')[0];

            onChange(
              changeElementAtIndex(
                passingTimes,
                {
                  ...passingTimes[index],
                  arrivalTime:
                    index === 0 ? date : passingTimes[index].arrivalTime,
                  departureTime: date,
                },
                index
              )
            );
          }}
          prepend={<ClockIcon inline />}
          selectedTime={toDate(passingTime.departureTime)}
        />
        {getDayOffsetDropdown(
          passingTime,
          index,
          'departureDayOffset',
          'arrivalDayOffset',
          isLast,
          index === 0
        )}
      </>
    );
  };

  const error = getErrorFeedback(errorMessage, isValid, !spoilPristine);

  return (
    <>
      {error?.feedback && (
        <SmallAlertBox variant="error">{error.feedback}</SmallAlertBox>
      )}
      <div className="passing-times-editor">
        {passingTimes.map((passingTime, index) => (
          <div key={index} className="passing-time">
            <div className="time-number">{index + 1}</div>
            <PassingTimeTitle
              flexibleStopPlaces={flexibleStopPlaces}
              stopPoint={stopPoints[index]}
            />
            {getTimePicker(passingTime, index, index === stopPoints.length - 1)}
          </div>
        ))}
      </div>
    </>
  );
};

const mapStateToProps = ({ flexibleStopPlaces, intl }: StateProps) => ({
  flexibleStopPlaces,
  intl,
});

export default connect(mapStateToProps)(PassingTimesEditor);
