import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule }           from '@angular/forms';
import { RouterTestingModule }                         from '@angular/router/testing';
import { MessageService }                              from 'primeng/api';
import { ToastModule }                                 from 'primeng/toast';

import { PremiumComponent } from './premium.component';
import { AuthService }       from '../core/services/auth.service';

// ── Mock AuthService ──────────────────────────────────────────
// Refleja los roles reales de tu AuthService: 'FREE' | 'PREMIUM' | 'ADMIN'
const mockUser = { id: 1, name: 'Test User', role: 'FREE' as 'FREE' | 'PREMIUM' | 'ADMIN' };

const authServiceMock = {
  isPremium: () => mockUser.role === 'PREMIUM',
  getUser:   () => mockUser,
  login:     (user: typeof mockUser) => { mockUser.role = user.role; },
};

// ─────────────────────────────────────────────────────────────
describe('PremiumComponent', () => {
  let component: PremiumComponent;
  let fixture:   ComponentFixture<PremiumComponent>;

  beforeEach(async () => {
    mockUser.role = 'FREE'; // resetear antes de cada test

    await TestBed.configureTestingModule({
      imports: [
        PremiumComponent,       // standalone → va en imports, NO en declarations
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        ToastModule,
      ],
      providers: [
        { provide: AuthService,    useValue: authServiceMock },
        { provide: MessageService, useValue: { add: jasmine.createSpy('add') } },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(PremiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Creación ──────────────────────────────────────────────────
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ── Estado inicial ────────────────────────────────────────────
  it('should start with basic plan active', () => {
    expect(component.currentPlan).toBe('basic');
  });

  it('should start with modal closed', () => {
    expect(component.modalOpen).toBeFalse();
  });

  it('should start with all filter active', () => {
    expect(component.activeFilter).toBe('all');
  });

  it('should generate CAPTCHA on init', () => {
    expect(component.captchaA).toBeGreaterThan(0);
    expect(component.captchaB).toBeGreaterThan(0);
  });

  // ── Validación de formulario ──────────────────────────────────
  describe('Payment form validators', () => {

    it('should be invalid when empty', () => {
      expect(component.paymentForm.valid).toBeFalse();
    });

    it('should reject short card name (< 3 chars)', () => {
      component.paymentForm.get('cardName')!.setValue('AB');
      expect(component.paymentForm.get('cardName')!.invalid).toBeTrue();
    });

    it('should accept valid card name', () => {
      component.paymentForm.get('cardName')!.setValue('María García');
      expect(component.paymentForm.get('cardName')!.valid).toBeTrue();
    });

    it('should reject card number with less than 16 digits', () => {
      component.paymentForm.get('cardNumber')!.setValue('1234 5678 9012');
      expect(component.paymentForm.get('cardNumber')!.invalid).toBeTrue();
    });

    it('should accept a properly formatted 16-digit card number', () => {
      component.paymentForm.get('cardNumber')!.setValue('1234 5678 9012 3456');
      expect(component.paymentForm.get('cardNumber')!.valid).toBeTrue();
    });

    it('should reject invalid expiry month (13)', () => {
      component.paymentForm.get('cardExpiry')!.setValue('13/25');
      expect(component.paymentForm.get('cardExpiry')!.invalid).toBeTrue();
    });

    it('should accept valid expiry MM/AA', () => {
      component.paymentForm.get('cardExpiry')!.setValue('12/28');
      expect(component.paymentForm.get('cardExpiry')!.valid).toBeTrue();
    });

    it('should reject CVV with less than 3 digits', () => {
      component.paymentForm.get('cardCvv')!.setValue('12');
      expect(component.paymentForm.get('cardCvv')!.invalid).toBeTrue();
    });

    it('should accept valid 3-digit CVV', () => {
      component.paymentForm.get('cardCvv')!.setValue('123');
      expect(component.paymentForm.get('cardCvv')!.valid).toBeTrue();
    });
  });

  // ── CAPTCHA ───────────────────────────────────────────────────
  describe('CAPTCHA', () => {

    it('should mark captcha correct when answer matches', () => {
      component.captchaInput = component.captchaA + component.captchaB;
      component.checkCaptcha();
      expect(component.captchaCorrect).toBeTrue();
    });

    it('should mark captcha incorrect for wrong answer', () => {
      component.captchaInput = component.captchaA + component.captchaB + 1;
      component.checkCaptcha();
      expect(component.captchaCorrect).toBeFalse();
    });

    it('should reset captcha state on newCaptcha()', () => {
      component.captchaInput   = 5;
      component.captchaCorrect = true;
      component.newCaptcha();
      expect(component.captchaInput).toBeNull();
      expect(component.captchaCorrect).toBeNull();
    });
  });

  // ── Modal ─────────────────────────────────────────────────────
  describe('Modal', () => {

    it('should open modal when user is logged in', () => {
      component.openModal();
      expect(component.modalOpen).toBeTrue();
    });

    it('should NOT open modal when user is null', () => {
      spyOn(authServiceMock, 'getUser').and.returnValue(null as any);
      component.openModal();
      expect(component.modalOpen).toBeFalse();
    });

    it('should close modal and reset form', () => {
      component.openModal();
      component.paymentForm.get('cardName')!.setValue('Test User');
      component.closeModal();
      expect(component.modalOpen).toBeFalse();
      expect(component.paymentForm.get('cardName')!.value).toBeNull();
    });
  });

  // ── Flujo de pago ─────────────────────────────────────────────
  describe('Payment process', () => {

    function fillValidForm(): void {
      component.paymentForm.setValue({
        cardName:   'María García',
        cardNumber: '1234 5678 9012 3456',
        cardExpiry: '12/28',
        cardCvv:    '123',
      });
      component.captchaInput   = component.captchaA + component.captchaB;
      component.captchaCorrect = true;
    }

    it('should NOT process payment with invalid form', () => {
      component.processPayment();
      expect(component.isProcessing).toBeFalse();
    });

    it('should NOT process payment with wrong CAPTCHA', () => {
      fillValidForm();
      component.captchaCorrect = false;
      component.processPayment();
      expect(component.isProcessing).toBeFalse();
    });

    it('should set isProcessing = true after valid submission', () => {
      fillValidForm();
      component.processPayment();
      expect(component.isProcessing).toBeTrue();
    });

    it('should show receipt after 2200ms', fakeAsync(() => {
      fillValidForm();
      component.processPayment();
      tick(2200);
      expect(component.paymentSuccess).toBeTrue();
      expect(component.receipt.name).toBe('MARÍA GARCÍA');
      expect(component.receipt.card).toContain('3456');
    }));

    it('should generate a folio starting with RN-', fakeAsync(() => {
      fillValidForm();
      component.processPayment();
      tick(2200);
      expect(component.receipt.folio).toMatch(/^RN-/);
    }));
  });

  // ── Gestión del plan ──────────────────────────────────────────
  // currentPlan es un GETTER (no asignable directamente).
  // Se testea mockeando authServiceMock.login / isPremium
  describe('Plan management', () => {

    it('should call auth.login with PREMIUM role on activatePremium()', () => {
      const loginSpy = spyOn(authServiceMock, 'login').and.callThrough();
      component.activatePremium();
      expect(loginSpy).toHaveBeenCalledWith(jasmine.objectContaining({ role: 'PREMIUM' }));
    });

    it('currentPlan getter returns premium after auth sets PREMIUM role', () => {
      mockUser.role = 'PREMIUM';
      expect(component.currentPlan).toBe('premium');
    });

    it('should update banner to premium state', () => {
      mockUser.role = 'PREMIUM';
      expect(component.activePlanName).toContain('Premium');
      expect(component.bannerIcon).toBe('👑');
    });

    it('should call auth.login with FREE role on confirmed downgrade', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      const loginSpy = spyOn(authServiceMock, 'login').and.callThrough();
      mockUser.role = 'PREMIUM';
      component.downgrade();
      expect(loginSpy).toHaveBeenCalledWith(jasmine.objectContaining({ role: 'FREE' }));
    });

    it('should NOT call auth.login when downgrade is cancelled', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      const loginSpy = spyOn(authServiceMock, 'login');
      mockUser.role = 'PREMIUM';
      component.downgrade();
      expect(loginSpy).not.toHaveBeenCalled();
    });
  });

  // ── Filtros ───────────────────────────────────────────────────
  describe('Filters', () => {

    it('should set activeFilter to premium', () => {
      component.filterPlans('premium');
      expect(component.activeFilter).toBe('premium');
    });

    it('should set activeFilter to basic', () => {
      component.filterPlans('basic');
      expect(component.activeFilter).toBe('basic');
    });

    it('should toggle statusActive on/off', () => {
      expect(component.statusActive).toBeTrue();
      component.toggleStatusFilter();
      expect(component.statusActive).toBeFalse();
      component.toggleStatusFilter();
      expect(component.statusActive).toBeTrue();
    });
  });

  // ── Route Guards ─────────────────────────────────────────────
  describe('Route guard labels', () => {

    it('should show locked for premium routes when plan is FREE', () => {
      mockUser.role = 'FREE';
      const route = component.routes.find(r => r.requiresPremium)!;
      expect(component.getRouteStatusClass(route)).toBe('rs-locked');
      expect(component.getRouteStatusLabel(route)).toBe('🔒 Premium');
    });

    it('should show unlocked for premium routes when plan is PREMIUM', () => {
      mockUser.role = 'PREMIUM';
      const route = component.routes.find(r => r.requiresPremium)!;
      expect(component.getRouteStatusClass(route)).toBe('rs-premium');
      expect(component.getRouteStatusLabel(route)).toBe('👑 Desbloqueado');
    });

    it('should always show free for open routes', () => {
      const route = component.routes.find(r => !r.requiresPremium)!;
      expect(component.getRouteStatusClass(route)).toBe('rs-open');
      expect(component.getRouteStatusLabel(route)).toBe('🟢 Libre');
    });
  });

  // ── Card flip ─────────────────────────────────────────────────
  describe('Card flip', () => {

    it('should set cardFlipped = true on CVV focus', () => {
      component.cardFlipped = true;
      expect(component.cardFlipped).toBeTrue();
    });

    it('should set cardFlipped = false on blur', () => {
      component.cardFlipped = true;
      component.cardFlipped = false;
      expect(component.cardFlipped).toBeFalse();
    });
  });

  // ── Step indicator ────────────────────────────────────────────
  describe('Step indicator', () => {

    it('should start at step 1', () => {
      expect(component.currentStep).toBe(1);
    });

    it('should return active for current step', () => {
      component.currentStep = 2;
      expect(component.getStepClass(2)).toBe('active');
    });

    it('should return done for steps before current', () => {
      component.currentStep = 3;
      expect(component.getStepClass(1)).toBe('done');
      expect(component.getStepClass(2)).toBe('done');
    });

    it('should return empty string for future steps', () => {
      component.currentStep = 1;
      expect(component.getStepClass(3)).toBe('');
    });
  });

  // ── Card display getters ──────────────────────────────────────
  describe('Card display getters', () => {

    it('should show placeholder when name is empty', () => {
      expect(component.cardNameDisplay).toBe('NOMBRE COMPLETO');
    });

    it('should uppercase the card name', () => {
      component.paymentForm.get('cardName')!.setValue('ana lopez');
      expect(component.cardNameDisplay).toBe('ANA LOPEZ');
    });

    it('should show MM/AA placeholder when expiry is empty', () => {
      expect(component.cardExpDisplay).toBe('MM/AA');
    });

    it('should mask CVV as dots', () => {
      component.paymentForm.get('cardCvv')!.setValue('456');
      expect(component.cardCvvDisplay).toBe('•••');
    });
  });
});