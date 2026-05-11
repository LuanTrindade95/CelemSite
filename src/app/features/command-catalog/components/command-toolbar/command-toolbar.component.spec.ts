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
      language: '',
      sortMode: 'project',
    });
    fixture.componentRef.setInput('projects', ['CelemBank']);
    fixture.componentRef.setInput('permissions', ['Player']);
    fixture.componentRef.setInput('languages', ['en']);
    fixture.detectChanges();
  });

  it('emits updated filters', () => {
    spyOn(fixture.componentInstance.filtersChange, 'emit');
    fixture.componentInstance.update({ query: 'bank' });
    expect(fixture.componentInstance.filtersChange.emit).toHaveBeenCalledWith(jasmine.objectContaining({ query: 'bank' }));
  });
});
