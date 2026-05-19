import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommandToolbarComponent } from './command-toolbar.component';

describe('CommandToolbarComponent', () => {
  let fixture: ComponentFixture<CommandToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandToolbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommandToolbarComponent);
    fixture.componentRef.setInput('filters', {
      query: '',
      project: '',
      permission: '',
      sortMode: 'project',
    });
    fixture.componentRef.setInput('projects', ['CelemBank']);
    fixture.componentRef.setInput('permissions', ['player']);
    fixture.componentRef.setInput('displayCategory', (category: string) => category);
    fixture.detectChanges();
  });

  it('emits updated filters', () => {
    spyOn(fixture.componentInstance.filtersChange, 'emit');
    fixture.componentInstance.update({ permission: 'player' });
    expect(fixture.componentInstance.filtersChange.emit).toHaveBeenCalledWith(jasmine.objectContaining({ permission: 'player' }));
  });

  it('opens and closes the mobile filter drawer state', () => {
    fixture.componentInstance.openDrawer();
    expect(fixture.componentInstance.isDrawerOpen()).toBeTrue();

    fixture.componentInstance.closeDrawer();
    expect(fixture.componentInstance.isDrawerOpen()).toBeFalse();
  });
});
