import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TriviaStateService } from 'src/app/services/trivia-state.service';
import { Category, Category2LabelMapping } from 'src/typings/category.enum';

@Component({
  selector: 'app-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss']
})
export class CategorySelectorComponent implements OnInit {
  public SelectedCategory = "";
  public Category2LabelMapping = Category2LabelMapping;
  public Categories = Object.values(Category);

  @Output()
  public CategorySelected = new EventEmitter<string>(); 

  constructor(
    private triviaState: TriviaStateService
  ) { }

  ngOnInit(): void {
  }

  public HandleCategorySelected(): void {
    this.triviaState.SelectedCategory = this.SelectedCategory;
    this.CategorySelected.emit(this.SelectedCategory);
  }

}
