/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useCallback } from 'react';
import { EuiAccordion, EuiSpacer } from '@elastic/eui';
import { PanelItem } from './config_panel_item';

export const ConfigValueOptions = ({
  visualizations,
  schemas,
  vizState,
  handleConfigChange,
  sectionName,
  sectionId = 'valueOptions'
}: any) => {
  const { data, vis } = visualizations;
  const { data: vizData = {}, metadata: { fields = [] } = {} } = data?.rawVizData;
  const handleConfigurationChange = useCallback(
    (stateFiledName) => {
      return (changes) => {
        handleConfigChange({
          ...vizState,
          [stateFiledName]: changes,
        });
      };
    },
    [handleConfigChange, vizState]
  );

  // get dropDownOptions list
  // If chat is time-series then filter out timestamp fields to category axis (xaxis)
  const getDropdownList = (schema) => schema?.options?.map((option) => ({ name: option })) ||
    vis.name === 'time_series' ? fields.filter((item) => schema.name === 'X-axis' ? item.type === 'timestamp' : item.type !== 'timestamp')
    : fields.map((item) => ({ ...item }));

  const dimensions = useMemo(() => {
    return schemas.map((schema, index) => {
      const DimensionComponent = schema.component || PanelItem;
      const params = {
        paddingTitle: schema.name,
        advancedTitle: 'advancedTitle',
        dropdownList: getDropdownList(schema),
        onSelectChange: handleConfigurationChange(schema.mapTo),
        isSingleSelection: schema.isSingleSelection,
        selectedAxis: vizState[schema.mapTo],
        vizState,
        ...schema.props,
      };
      return (
        <>
          <DimensionComponent key={`viz-series-${index}`} {...params} />
          <EuiSpacer size="s" />
        </>
      );
    });
  }, [schemas, fields, vizState, handleConfigurationChange]);

  return (
    <EuiAccordion
      initialIsOpen
      id={`configPanel__${sectionId}`}
      buttonContent={sectionName}
      paddingSize="s"
    >
      {dimensions}
    </EuiAccordion>
  );
};
