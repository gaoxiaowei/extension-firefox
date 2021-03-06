import { idescribe, iit, ibeforeEach } from '../core';
import { LoginPage } from '../pages/login';
import { AuthenticatedPage } from '../pages/authenticated';
import { SettingsPage } from '../pages/settings';
import { translate } from '../scripts/translate';
import { expect } from 'chai';
import { AuthFailPage } from '../pages/authfail';
import { ConnFailPage } from '../pages/connfail';
import { getStorage } from '../scripts/getStorage';
import { FingerprintPage } from '../pages/fingerprint';

idescribe('the application language', function () {
  let loginPage: LoginPage;
  let settingsPage: SettingsPage;
  let authPage: AuthenticatedPage;
  let authfailPage: AuthFailPage;
  let connfailPage: ConnFailPage;
  let fingerprintPage: FingerprintPage;

  ibeforeEach(async function () {
    loginPage = new LoginPage();
    settingsPage = new SettingsPage();
    authPage = new AuthenticatedPage();
    authfailPage = new AuthFailPage();
    connfailPage = new ConnFailPage();
    fingerprintPage = new FingerprintPage();

    await loginPage.navigate();
    await fingerprintPage.optIn();
    await loginPage.signIn();
    await authPage.menu.settings.click();
    await settingsPage.extensionSection.expand();
    await settingsPage.changeLanguage();
  });

  iit('is translated properly by translator function', async function () {
    const expectedTranslated = 'Fermer';
    const actualTranslated = await translate(this.script, 'CloseText');
    expect(actualTranslated).to.eq(expectedTranslated);
  });

  iit('can be changed from language dropdown in settings', async function () {
    const expectedTitle = (await translate(this.script, 'ChangeExtensionSettings')).toUpperCase();
    const acutalTitle = await settingsPage.title.getText();
    expect(acutalTitle).to.eq(expectedTitle);
  });

  iit('applies to authfail page', async function () {
    await authfailPage.navigate();
    const expected = await translate(this.script, 'AuthFailTitle');
    const actual = await authfailPage.title.getText();
    expect(actual).to.eq(expected);
  });

  iit('applies to connfail page', async function () {
    await connfailPage.navigate();
    const expected = await translate(this.script, 'ConnectionFailTitle');
    const actual = await connfailPage.title.getText();
    expect(actual).to.eq(expected);
  });

  iit('changes domain for account control panel', async function () {
    await settingsPage.back.click();
    await authPage.menu.account.click();
    await this.windows
      .expectNextTabIs('https://fra.privateinternetaccess.com/pages/client-control-panel');
  });

  iit('stores locale in local storage', async function () {
    const expected = 'fr';
    const actual = await getStorage(this.script, 'locale');
    expect(actual).to.eq(expected);
  });
});
