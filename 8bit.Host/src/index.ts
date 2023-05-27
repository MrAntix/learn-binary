import { ABitGridComponent } from './bit-grid/component';
import { AIconComponent } from './icon/component';
import { ANotificationsComponent } from './notifications/component';
import { ANumberPadComponent } from './number-pad/component';
import { ARootComponent } from './root/component';
import { ATimerComponent } from './timer/component';

window.customElements.define('a-root', ARootComponent);
window.customElements.define('a-icon', AIconComponent);
window.customElements.define('a-notifications', ANotificationsComponent);
window.customElements.define('a-number-pad', ANumberPadComponent);
window.customElements.define('a-timer', ATimerComponent);
window.customElements.define('a-bit-grid', ABitGridComponent);