import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { HeartbeatService } from './heartbeat.service';

describe('HeartbeatService', () => {
  let service: HeartbeatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeartbeatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('startHeartbeat should call sendHeartbeat and listenForActivity', fakeAsync(() => {
    const userId = '123';
    spyOn(service['loginService'], 'getUserId').and.returnValue(userId);
    spyOn(service['ngZone'], 'runOutsideAngular').and.callFake((fn: Function) => fn());
    const sendHeartbeatSpy = spyOn(service, 'sendHeartbeat').and.returnValue(Promise.resolve());
    const listenForActivitySpy = spyOn(service, 'listenForActivity');

    service.startHeartbeat(userId);
    tick();

    expect(sendHeartbeatSpy).toHaveBeenCalledWith(userId);
    expect(listenForActivitySpy).toHaveBeenCalled();

    service.stopHeartbeat();
  }));

  it('should not start heartbeat if userId is null', () => {
    const userId = null;
    const sendHeartbeatSpy = spyOn(service, 'sendHeartbeat');
    const listenForActivitySpy = spyOn(service, 'listenForActivity');

    service.startHeartbeat(userId as any);

    expect(sendHeartbeatSpy).not.toHaveBeenCalled();
    expect(listenForActivitySpy).not.toHaveBeenCalled();
  });

  it('should throw an error when sendHeartbeat POST request fails', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: false,
      status: 500
    } as Response));

    await expectAsync(service.sendHeartbeat('123'))
      .toBeRejectedWithError('POST failed: 500');
  });

  it('should throw an error when sendHeartbeat fetch encounters a network failure', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.sendHeartbeat('123'))
      .toBeRejectedWithError('Network Error');
  });

  it('should successfully call sendHeartbeat with correct parameters', async () => {
    const fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: true,
    } as Response));

    await expectAsync(service.sendHeartbeat('123'))
      .toBeResolved();

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/heartbeat?userId=123',
    Object({ method: 'POST' }));
  });

  it('stopHeartbeat should clear timers and reset currentUserId', () => {
    service['heartbeatTimer'] = setInterval(() => {}, 1000);
    service['activityTimer'] = setTimeout(() => {}, 1000);
    service['currentUserId'] = 'testUserId';

    service.stopHeartbeat();

    expect(service['heartbeatTimer']).toBeNull();
    expect(service['activityTimer']).toBeNull();
    expect(service['currentUserId']).toBeNull();
  });

  it('should call onInactivity when resetActivityTimer finishes', fakeAsync(() => {
    spyOn<any>(service, 'sendHeartbeat').and.returnValue(Promise.resolve());
    const onInactivitySpy = spyOn<any>(service, 'onInactivity'); // <== private method spy

    service['resetActivityTimer']();
    tick(service['activityTimeout']);

    expect(onInactivitySpy).toHaveBeenCalled();
  }));

  it('should call resetActivityTimer when listenForActivity is called', () => {
    const resetActivityTimerSpy = spyOn<any>(service, 'resetActivityTimer');

    service.listenForActivity();

    expect(resetActivityTimerSpy).toHaveBeenCalled();
  });

  it('should call resetActivityTimer when user is active', () => {
    const resetActivityTimerSpy = spyOn<any>(service, 'resetActivityTimer');
    const event = new Event('mousemove');

    service.listenForActivity();
    window.dispatchEvent(event);

    expect(resetActivityTimerSpy).toHaveBeenCalled();
  });

  it('should go through the onInactivity function', () => {
    const stopHeartbeatSpy = spyOn<any>(service, 'stopHeartbeat');
    const signOutSpy = spyOn(service['loginService'], 'signOut');
  const resetSpy = spyOn(service['assignmentService'], 'reset');
  const routerSpy = spyOn(service['router'], 'navigate');

    service['onInactivity']();

    expect(stopHeartbeatSpy).toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
    expect(signOutSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });
});
