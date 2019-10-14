import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { Button, Label, TextField, Checkbox } from '@entur/component-library';

import { Export } from '../../../../model';
import { saveExport } from '../../../../actions/exports';
import OverlayLoader from '../../../../components/OverlayLoader';
import CustomDatepicker from '../../../../components/CustomDatepicker';
import { selectIntl } from '../../../../i18n';

import './styles.css';
import messages from './creator.messages';


const newExport = () => {
  const today = moment().format('YYYY-MM-DD');
  return new Export({ fromDate: today, toDate: today })
}

const ExportsCreator = ({ history }) => {
  const {formatMessage} = useSelector(selectIntl);
  const [isSaving, setSaving] = useState(false);
  const [theExport, setTheExport] = useState(newExport());

  const dispatch = useDispatch();

  const handleOnSaveClick = () => {
    setSaving(true);
    dispatch(saveExport(theExport))
      .finally(() => history.push('/exports'))
  };

  const handleFieldChange = (field, value) => {
    setTheExport(theExport.withChanges({ [field]: value }));
  };

  return (
    <div className="export-editor">
      <div className="header">
        <h2>{formatMessage(messages.header)}</h2>

        <div className="buttons">
          <Button variant="success" onClick={handleOnSaveClick}>
            {formatMessage(messages.saveButtonLabelText)}
          </Button>
        </div>
      </div>

      <OverlayLoader isLoading={isSaving} text={formatMessage(messages.savingOverlayLoaderText)}>
        <div className="export-form">
          <Label>{formatMessage(messages.nameFormLabel)}</Label>
          <TextField
            type="text"
            value={theExport.name}
            onChange={e => handleFieldChange('name', e.target.value)}
          />

          <Label>{formatMessage(messages.fromDateFormLabel)}</Label>
          <CustomDatepicker
            startDate={theExport.fromDate}
            onChange={date => handleFieldChange('fromDate', date)}
          />

          <Label>{formatMessage(messages.toDateFormLabel)}</Label>
          <CustomDatepicker
            startDate={theExport.toDate}
            onChange={date => handleFieldChange('toDate', date)}
          />

          <Label>{formatMessage(messages.dryRunFormLabel)}</Label>
          <Checkbox
            value="1"
            checked={theExport.dryRun === true}
            onChange={e =>
              handleFieldChange('dryRun', e.target.checked)
            }
          />
        </div>
      </OverlayLoader>
    </div>
  );
}

export default withRouter(ExportsCreator);
