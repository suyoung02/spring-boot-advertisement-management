export const getMachineId = () => {
  let machineId = localStorage.getItem('MachineId');

  if (!machineId) {
    machineId = crypto.randomUUID();
    localStorage.setItem('MachineId', machineId);
  }

  return machineId;
};

const parseUA = () => {
  const ua = navigator.userAgent;
  let matches =
    ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) ||
    [];
  // Work with the matches.
  matches = matches[2]
    ? [matches[1], matches[2]]
    : [navigator.appName, navigator.appVersion, '-?'];
  return { ua, matches };
};

export const getBrowserVersion = () => {
  const { ua, matches } = parseUA();
  // Trident.
  let temp;
  if (/trident/i.test(matches[1])) {
    temp = /\brv[ :]+(\d+)/g.exec(ua) || [];
    const version = temp[1] || '';
    return { name: 'IE', version };
  }

  // Chrome.
  if (matches[1] === 'Chrome') {
    const temp = ua.match(/\bOPR|Edge\/(\d+)/);
    if (temp !== null) {
      const version = temp[1];
      return { name: 'Opera', version };
    }
  }

  if ((temp = ua.match(/version\/(\d+)/i)) != null) {
    matches.splice(1, 1, temp[1]);
  }

  const name = matches[0];
  const version = matches[1];
  return { name, version };
};
