/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

import * as React from 'react';
import SafeAreaView from '../../Components/SafeAreaView/SafeAreaView';
import StyleSheet from '../../StyleSheet/StyleSheet';
import View from '../../Components/View/View';
import LogBoxInspector from './LogBoxInspector';
import LogBoxLog from '../Data/LogBoxLog';
import LogBoxLogNotification from './LogBoxLogNotification';
import type {LogBoxLogs} from '../Data/LogBoxData';

type Props = $ReadOnly<{|
  onDismiss: (log: LogBoxLog) => void,
  onDismissAll: () => void,
  logs: LogBoxLogs,
|}>;

function LogBoxContainer(props: Props): React.Node {
  const [selectedLogIndex, setSelectedLog] = React.useState(null);

  const logs = Array.from(props.logs);

  function handleInspectorDismissAll() {
    props.onDismissAll();
  }

  function handleInspectorDismiss() {
    // Here we handle the cases when the log is dismissed and it
    // was either the last log, or when the current index
    // is now outside the bounds of the log array.
    if (selectedLogIndex != null) {
      if (logs.length - 1 <= 0) {
        setSelectedLog(null);
      } else if (selectedLogIndex >= logs.length - 1) {
        setSelectedLog(selectedLogIndex - 1);
      }
      props.onDismiss(logs[selectedLogIndex]);
    }
  }

  function handleInspectorMinimize() {
    setSelectedLog(null);
  }

  function openLog(log: LogBoxLog) {
    let index = logs.length - 1;
    while (index > 0 && logs[index] !== log) {
      index -= 1;
    }
    setSelectedLog(index);
  }

  if (selectedLogIndex != null) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <LogBoxInspector
          onDismiss={handleInspectorDismiss}
          onMinimize={handleInspectorMinimize}
          onChangeSelectedIndex={setSelectedLog}
          logs={logs}
          selectedIndex={selectedLogIndex}
        />
      </View>
    );
  }

  if (logs.length === 0) {
    return null;
  }

  const warnings = logs.filter(log => log.level === 'warn');
  const errors = logs.filter(log => log.level === 'error');
  return (
    <View style={styles.list}>
      {warnings.length > 0 && (
        <View style={styles.toast}>
          <LogBoxLogNotification
            log={warnings[warnings.length - 1]}
            level="warn"
            totalLogCount={warnings.length}
            onPressOpen={() => openLog(warnings[warnings.length - 1])}
            onPressList={() => {
              /* TODO: open log list */
            }}
            onPressDismiss={handleInspectorDismissAll}
          />
        </View>
      )}
      {errors.length > 0 && (
        <View style={styles.toast}>
          <LogBoxLogNotification
            log={errors[errors.length - 1]}
            level="error"
            totalLogCount={errors.length}
            onPressOpen={() => openLog(errors[errors.length - 1])}
            onPressList={() => {
              /* TODO: open log list */
            }}
            onPressDismiss={handleInspectorDismissAll}
          />
        </View>
      )}
      <SafeAreaView style={styles.safeArea} />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    bottom: 10,
    left: 10,
    right: 10,
    position: 'absolute',
  },
  toast: {
    borderRadius: 8,
    marginBottom: 5,
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
});

export default LogBoxContainer;
