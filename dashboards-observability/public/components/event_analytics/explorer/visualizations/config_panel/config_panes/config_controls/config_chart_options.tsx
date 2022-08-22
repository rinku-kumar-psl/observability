/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useCallback, Fragment } from 'react';
import { EuiAccordion, EuiSpacer, EuiForm } from '@elastic/eui';
import { PanelItem } from './config_panel_item';
import { SPECTRUM, OPACITY } from '../../../../../../../../common/constants/colors';
import { elementTypes } from '../../../../../../../../common/constants/explorer';
import { ConfigPanelProps } from '../../../../../../../../common/types/explorer';

export const ConfigChartOptions = ({
  visualizations,
  schemas,
  vizState,
  handleConfigChange,
}: ConfigPanelProps) => {
  const { data } = visualizations;
  const { metadata: { fields = [] } = {}, tree_map } = data?.rawVizData;

  const handleConfigurationChange = useCallback(
    (stateFiledName) => {
      return (changes: string | number) => {
        handleConfigChange({
          ...vizState,
          [stateFiledName]: changes,
        });
      };
    },
    [handleConfigChange, vizState]
  );

  const currentSchemas = useMemo(() => {
    if (vizState?.colorMode === undefined || vizState?.colorMode[0].name === SPECTRUM) {
      return schemas.filter((schema) => schema.mapTo !== 'color');
    }
    if (vizState.colorMode && vizState?.colorMode[0].name === OPACITY) {
      return schemas.filter((schema) => schema.mapTo !== 'scheme');
    }
    return schemas;
  }, [vizState]);

  const dimensions = useMemo(() => {
    return (
      currentSchemas &&
      currentSchemas.map((schema, index: number) => {
        let params = {
          title: schema.name,
          vizState,
          ...schema.props,
        };
        const DimensionComponent = schema.component || PanelItem;
        const { eleType } = schema;
        switch (eleType) {
          case elementTypes.PalettePicker:
            params = {
              ...params,
              colorPalettes: schema.options || [],
              selectedColor: (vizState && vizState[schema.mapTo]) || schema.defaultState,
              onSelectChange: handleConfigurationChange(schema.mapTo),
            };
            break;
          case elementTypes.SingleColorPicker:
            params = {
              ...params,
              selectedColor: (vizState && vizState[schema.mapTo]) || schema.defaultState,
              onSelectChange: handleConfigurationChange(schema.mapTo),
            };
            break;
          case elementTypes.Colorpicker:
            params = {
              ...params,
              selectedColor: (vizState && vizState[schema.mapTo]) || schema?.defaultState,
              colorPalettes: schema.options || [],
              onSelectChange: handleConfigurationChange(schema.mapTo),
            };
            break;
          case elementTypes.TreemapColorPicker:
            params = {
              ...params,
              selectedColor: (vizState && vizState[schema.mapTo]) || schema?.defaultState,
              colorPalettes: schema.options || [],
              numberOfParents:
                (tree_map?.dataConfig?.dimensions !== undefined &&
                  tree_map?.dataConfig.dimensions[0].parentFields.length) | 0,
              onSelectChange: handleConfigurationChange(schema.mapTo),
            };
            break;
          case elementTypes.Input:
            params = {
              ...params,
              currentValue: (vizState && vizState[schema.mapTo]) || '',
              numValue: (vizState && vizState[schema.mapTo]) || '',
              handleInputChange: handleConfigurationChange(schema.mapTo),
            };
            break;
          case elementTypes.Slider:
            params = {
              ...params,
              maxRange: schema.props.max,
              currentRange: (vizState && vizState[schema.mapTo]) || schema?.defaultState,
              handleSliderChange: handleConfigurationChange(schema.mapTo),
            };
            break;
          case elementTypes.SwitchButton:
            params = {
              ...params,
              title: schema.name,
              currentValue: (vizState && vizState[schema.mapTo]) || false,
              onToggle: handleConfigurationChange(schema.mapTo),
            };
            break;
          case elementTypes.Buttons:
            params = {
              ...params,
              title: schema.name,
              legend: schema.name,
              groupOptions: schema?.props?.options.map((btn: { name: string }) => ({
                ...btn,
                label: btn.name,
              })),
              idSelected:
                (vizState && vizState[schema.mapTo]) || schema?.props?.defaultSelections[0]?.id,
              handleButtonChange: handleConfigurationChange(schema.mapTo),
            };
            break;
          default:
            params = {
              ...params,
              paddingTitle: schema.name,
              advancedTitle: 'advancedTitle',
              dropdownList:
                schema?.options?.map((option) => ({ ...option })) ||
                fields.map((item) => ({ ...item })),
              onSelectChange: handleConfigurationChange(schema.mapTo),
              isSingleSelection: schema.isSingleSelection,
              selectedAxis: (vizState && vizState[schema.mapTo]) || schema.defaultState,
            };
        }

        return (
          <Fragment key={`viz-series-${index}`}>
            <EuiForm component="form">
              <DimensionComponent  {...params} />
              <EuiSpacer size="s" />
            </EuiForm>
          </Fragment>
        );
      })
    );
  }, [currentSchemas, vizState, handleConfigurationChange]);

  return (
    <EuiAccordion
      initialIsOpen
      id="configPanel__chartStyles"
      buttonContent="Chart styles"
      paddingSize="s"
    >
      {dimensions}
    </EuiAccordion>
  );
};
